from datetime import date
import asyncio
import re

from app.schemas.chat import SessaoViagem, RespostaChat
from app.services.serpAPI import buscar_voos, buscar_hoteis
from app.services.tripAdvisor import buscar_atracoes
from app.services.openWeather import buscar_clima
from app.ia.llm_client import gerar_roteiro

# ── Constantes ────────────────────────────────────────────────────────────────

OPCOES_ESTILO = [
    "🏛️ Cultural e histórico",
    "🏖️ Praia e relaxamento",
    "🧗 Aventura e natureza",
    "🍽️ Gastronomia",
    "🛍️ Compras e urbano",
    "👨‍👩‍👧 Família",
]


# ── Helpers ──────────────────────────────────────────────────────────────────

def _extrair_numero(texto: str) -> float | None:
    nums = re.findall(r"[\d.,]+", texto.replace(".", "").replace(",", "."))
    try:
        return float(nums[0]) if nums else None
    except ValueError:
        return None


def _extrair_data(texto: str) -> str | None:
    """Aceita formatos: DD/MM/AAAA ou AAAA-MM-DD."""
    match = re.search(r"(\d{2})/(\d{2})/(\d{4})", texto)
    if match:
        return f"{match.group(3)}-{match.group(2)}-{match.group(1)}"
    match = re.search(r"(\d{4}-\d{2}-\d{2})", texto)
    if match:
        return match.group(1)
    return None


def _formatar_opcao_voo(voo: dict) -> str:
    return f"{voo['companhia']} — R$ {voo['preco']}"


def _resposta(sessao: SessaoViagem, etapa: str, mensagem: str, **kwargs) -> RespostaChat:
    """Atalho para montar a RespostaChat já com sessao_id e etapa atual."""
    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual=etapa,
        mensagem_bot=mensagem,
        **kwargs,
    )


def _selecionar_voo(sessao: SessaoViagem, msg: str) -> dict:
    """Encontra o voo escolhido pelo texto/índice; cai no primeiro como padrão."""
    disponiveis = sessao.voos_disponiveis or []
    if not disponiveis:
        return {}
    return next(
        (v for v in disponiveis if _formatar_opcao_voo(v) == msg or v.get("companhia", "") in msg),
        disponiveis[0],
    )


# ── Handlers por etapa ────────────────────────────────────────────────────────

async def _handle_destino(sessao: SessaoViagem, msg: str) -> RespostaChat:
    sessao.destino = msg
    sessao.etapa = "origem"
    return _resposta(
        sessao, "origem",
        f"Ótima escolha! *{sessao.destino}* vai ser incrível 🌍\n\nDe qual cidade você vai partir?",
    )


async def _handle_origem(sessao: SessaoViagem, msg: str) -> RespostaChat:
    sessao.origem = msg
    sessao.etapa = "pessoas"
    return _resposta(
        sessao, "pessoas",
        "Anotado! ✈️\n\nQuantas pessoas vão viajar?",
        opcoes=["1", "2", "3", "4", "5+"],
    )


async def _handle_pessoas(sessao: SessaoViagem, msg: str) -> RespostaChat:
    num = _extrair_numero(msg)
    sessao.num_pessoas = int(num) if num else 1
    sessao.etapa = "orcamento"
    return _resposta(
        sessao, "orcamento",
        f"Combinado, {sessao.num_pessoas} pessoa(s)! 👥\n\nQual é o orçamento total da viagem? (em R$)\nExemplo: R$ 5.000",
    )


async def _handle_orcamento(sessao: SessaoViagem, msg: str) -> RespostaChat:
    sessao.orcamento = _extrair_numero(msg)
    sessao.etapa = "datas"
    return _resposta(
        sessao, "datas",
        "Perfeito! 💰\n\nAgora me diga as datas da viagem.\nQual é a data de ida? (formato DD/MM/AAAA)",
    )


async def _handle_datas(sessao: SessaoViagem, msg: str) -> RespostaChat:
    # Primeiro coletamos a ida; depois a volta.
    if not sessao.data_ida:
        data = _extrair_data(msg)
        if not data:
            return _resposta(sessao, "datas", "Pode repetir a data de ida? (Ex: 15/07/2025)")
        sessao.data_ida = data
        return _resposta(
            sessao, "datas",
            f"Ida: {msg} ✅\n\nE a data de volta? (DD/MM/AAAA ou escreva 'só ida')",
        )

    if "só ida" in msg.lower():
        sessao.data_volta = None
    else:
        sessao.data_volta = _extrair_data(msg)
        if not sessao.data_volta:
            return _resposta(sessao, "datas", "Pode repetir a data de volta? (DD/MM/AAAA ou escreva 'só ida')")

    # Datas completas → buscar voos de IDA dentro do orçamento.
    voos = await buscar_voos(sessao.origem, sessao.destino, sessao.data_ida, orcamento=sessao.orcamento)
    sessao.voos_disponiveis = voos if isinstance(voos, list) else []

    if not sessao.voos_disponiveis:
        sessao.etapa = "hoteis"
        return await _etapa_hoteis(sessao)

    sessao.etapa = "voo_ida"
    return _resposta(
        sessao, "voo_ida",
        "Encontrei estas opções de voo de IDA. Qual você prefere?",
        opcoes=[_formatar_opcao_voo(v) for v in sessao.voos_disponiveis],
        dados_extra={"voos": sessao.voos_disponiveis},
    )


async def _handle_voo_ida(sessao: SessaoViagem, msg: str) -> RespostaChat:
    sessao.voo_ida_escolhido = _selecionar_voo(sessao, msg)

    if not sessao.data_volta:
        sessao.etapa = "hoteis"
        return await _etapa_hoteis(sessao)

    voos_volta = await buscar_voos(sessao.destino, sessao.origem, sessao.data_volta, orcamento=sessao.orcamento)
    sessao.voos_disponiveis = voos_volta if isinstance(voos_volta, list) else []

    if not sessao.voos_disponiveis:
        sessao.etapa = "hoteis"
        return await _etapa_hoteis(sessao)

    sessao.etapa = "voo_volta"
    return _resposta(
        sessao, "voo_volta",
        "Ótimo! Agora escolha o voo de VOLTA:",
        opcoes=[_formatar_opcao_voo(v) for v in sessao.voos_disponiveis],
        dados_extra={"voos": sessao.voos_disponiveis},
    )


async def _handle_voo_volta(sessao: SessaoViagem, msg: str) -> RespostaChat:
    sessao.voo_volta_escolhido = _selecionar_voo(sessao, msg)
    sessao.etapa = "hoteis"
    return await _etapa_hoteis(sessao)


async def _handle_hoteis(sessao: SessaoViagem, msg: str) -> RespostaChat:
    disponiveis = sessao.hoteis_disponiveis or [{}]
    try:
        idx = int(msg) - 1
        sessao.hotel_escolhido = disponiveis[idx] if 0 <= idx < len(disponiveis) else disponiveis[0]
    except ValueError:
        sessao.hotel_escolhido = disponiveis[0]

    sessao.etapa = "estilo"
    return _resposta(
        sessao, "estilo",
        "Ótima escolha! 🏨\n\nQual é o estilo da sua viagem?",
        opcoes=OPCOES_ESTILO,
    )


async def _handle_estilo(sessao: SessaoViagem, msg: str) -> RespostaChat:
    # Remove o emoji do prefixo, mantendo só o texto do estilo.
    sessao.estilo = re.sub(r"^[^\w]+", "", msg).strip()
    sessao.etapa = "interesses"
    return _resposta(
        sessao, "interesses",
        f"Perfeito, viagem com estilo *{sessao.estilo}*! ✨\n\nPor último: tem algum interesse ou pedido especial para o roteiro?\nEx: quero visitar museus à tarde, prefiro restaurantes locais, viajo com criança pequena…",
    )


async def _handle_interesses(sessao: SessaoViagem, msg: str) -> RespostaChat:
    sessao.interesses = msg
    sessao.etapa = "concluido"

    num_dias = _calcular_num_dias(sessao.data_ida, sessao.data_volta)

    atracoes, clima = await asyncio.gather(
        buscar_atracoes(sessao.destino),
        buscar_clima(sessao.destino, sessao.data_ida, sessao.data_volta),
        return_exceptions=True,
    )
    if isinstance(atracoes, Exception):
        atracoes = []
    if isinstance(clima, Exception):
        clima = {}

    dados = {
        "destino": sessao.destino,
        "origem": sessao.origem,
        "data_ida": sessao.data_ida,
        "data_volta": sessao.data_volta,
        "num_dias": num_dias,
        "num_pessoas": sessao.num_pessoas,
        "orcamento": sessao.orcamento,
        "estilo": sessao.estilo,
        "interesses": sessao.interesses,
        "voo_ida": sessao.voo_ida_escolhido,
        "voo_volta": sessao.voo_volta_escolhido,
        "hotel": sessao.hotel_escolhido,
        "atracoes": atracoes,
        "clima": clima,
    }

    roteiro = await gerar_roteiro(dados)
    return _resposta(
        sessao, "concluido",
        f"Seu roteiro para *{sessao.destino}* está pronto! 🎉",
        roteiro=roteiro,
    )


async def _handle_concluido(sessao: SessaoViagem, msg: str) -> RespostaChat:
    return _resposta(
        sessao, "concluido",
        "Seu roteiro já foi gerado! Role a tela para cima para visualizá-lo. Quer planejar uma nova viagem?",
        opcoes=["Nova viagem"],
    )


# ── Dispatcher ────────────────────────────────────────────────────────────────

_HANDLERS = {
    "destino": _handle_destino,
    "origem": _handle_origem,
    "pessoas": _handle_pessoas,
    "orcamento": _handle_orcamento,
    "datas": _handle_datas,
    "voo_ida": _handle_voo_ida,
    "voo_volta": _handle_voo_volta,
    "hoteis": _handle_hoteis,
    "estilo": _handle_estilo,
    "interesses": _handle_interesses,
}


async def processar_mensagem(sessao: SessaoViagem, mensagem: str) -> RespostaChat:
    """Encaminha a mensagem para o handler da etapa atual da sessão."""
    handler = _HANDLERS.get(sessao.etapa, _handle_concluido)
    return await handler(sessao, mensagem.strip())


# ── Etapas auxiliares ─────────────────────────────────────────────────────────

def _calcular_num_dias(data_ida: str | None, data_volta: str | None, padrao: int = 5) -> int:
    if data_ida and data_volta:
        try:
            ida = date.fromisoformat(data_ida)
            volta = date.fromisoformat(data_volta)
            return max((volta - ida).days, 1)
        except ValueError:
            pass
    return padrao


async def _etapa_hoteis(sessao: SessaoViagem) -> RespostaChat:
    hoteis = await buscar_hoteis(
        sessao.destino,
        sessao.data_ida,
        sessao.data_volta or sessao.data_ida,
        sessao.num_pessoas or 1,
        orcamento=sessao.orcamento,
    )
    sessao.hoteis_disponiveis = hoteis if hoteis else []

    if not sessao.hoteis_disponiveis:
        sessao.hotel_escolhido = {}
        sessao.etapa = "estilo"
        return _resposta(
            sessao, "estilo",
            "Não encontrei hotéis disponíveis, mas não tem problema! Vamos continuar.\n\nQual é o estilo da sua viagem?",
            opcoes=OPCOES_ESTILO,
        )

    opcoes_hotel = [
        f"{h['nome']} — {h['preco_noite']}/noite (⭐ {h['avaliacao']})"
        for h in sessao.hoteis_disponiveis
    ]
    return _resposta(
        sessao, "hoteis",
        "Agora vamos escolher a hospedagem 🏨\n\nEncontrei estas opções:",
        opcoes=opcoes_hotel,
        dados_extra={"hoteis": sessao.hoteis_disponiveis},
    )
