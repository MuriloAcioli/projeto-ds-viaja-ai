import json
import os
from google import genai
from google.genai import types

client = genai.Client()

SYSTEM_PROMPT = """Você é um especialista em roteiros de viagem personalizados para brasileiros.
Crie roteiros detalhados, práticos e com sugestões autênticas.
Responda SOMENTE com JSON válido."""


def montar_prompt(dados: dict) -> str:
    voo = dados.get("voo", {})
    hoteis = dados.get("hoteis", [])
    atracoes = dados.get("atracoes", [])
    clima = dados.get("clima", {})

    hoteis_texto = "\n".join(
        f"- {h['nome']}: {h['preco_noite']}/noite, avaliação {h['avaliacao']}"
        for h in hoteis
    )
    atracoes_texto = "\n".join(f"- {a['nome']} ({a['endereco']})" for a in atracoes)

    voo_texto = (
        f"{voo.get('companhia','N/A')} | R$ {voo.get('preco','?')} | "
        f"{voo.get('escalas', 0)} escala(s) | {voo.get('duracao_minutos', 0)} min"
        if voo else "Não informado"
    )

    previsao = clima.get("previsao_por_dia", [])
    if previsao:
        clima_dias = "\n".join(
            f"- {d['data']}: {d['descricao']}, {d['temp_min']}C a {d['temp_max']}C"
            + (" (chuva esperada)" if d["chuva"] else "")
            for d in previsao
        )
    else:
        clima_dias = clima.get("resumo", "Nao disponivel")

    return f"""Crie um roteiro de viagem personalizado com as informacoes abaixo.

=== DADOS DA VIAGEM ===
Destino: {dados['destino']}
Origem: {dados.get('origem', 'Brasil')}
Data de ida: {dados['data_ida']}
Data de volta: {dados.get('data_volta', 'nao definida')}
Numero de dias: {dados['num_dias']}
Pessoas: {dados.get('num_pessoas', 1)} pessoa(s)
Orcamento total: R$ {dados.get('orcamento', 'nao informado')}
Estilo de viagem: {dados.get('estilo', 'turismo geral')}
Interesses: {dados.get('interesses', 'nao informados')}

=== VOOS ENCONTRADOS ===
{voo_texto}

=== HOTEIS DISPONIVEIS ===
{hoteis_texto or 'Nao encontrados'}

=== ATRACOES E PONTOS DE INTERESSE ===
{atracoes_texto or 'Nao encontradas'}

=== PREVISAO DO TEMPO ===
Resumo: {clima.get('resumo', 'Nao disponivel')}
{clima_dias}

IMPORTANTE: Use a previsao do tempo para:
- Sugerir atividades indoor nos dias com chuva
- Recomendar horarios mais frescos para caminhadas em dias quentes
- Incluir dicas de vestuario adequadas no campo dicas_gerais

=== FORMATO DE RESPOSTA (JSON OBRIGATORIO) ===
{{
  "destino": "string",
  "resumo": "string com 2-3 frases descrevendo a viagem",
  "custo_estimado_total": number,
  "hotel_recomendado": "nome do hotel sugerido",
  "clima_resumo": "string resumindo o clima e dica de vestuario",
  "dicas_gerais": ["dica 1", "dica 2", "dica 3"],
  "dias": [
    {{
      "dia": 1,
      "data": "YYYY-MM-DD",
      "titulo": "string curto ex: Chegada e exploracao do centro",
      "clima_dia": "string ex: Ensolarado, 28C",
      "atividades": [
        {{
          "horario": "09:00",
          "nome": "string",
          "descricao": "string com 1-2 frases",
          "custo_estimado": number,
          "tipo": "atracao | refeicao | transporte | hospedagem | lazer"
        }}
      ]
    }}
  ]
}}"""


def montar_prompt_modificacao(roteiro_atual: dict, instrucao: str) -> str:
    import json
    return f"""Você receberá um roteiro de viagem em JSON e uma instrução de modificação do usuário.
Aplique SOMENTE a modificação solicitada, mantendo toda a estrutura e os demais dados intactos.

=== ROTEIRO ATUAL ===
{json.dumps(roteiro_atual, ensure_ascii=False, indent=2)}

=== INSTRUÇÃO DO USUÁRIO ===
{instrucao}

Responda SOMENTE com o JSON completo do roteiro modificado, no mesmo formato do roteiro atual."""


async def modificar_roteiro(roteiro_atual: dict, instrucao: str) -> dict:
    prompt = montar_prompt_modificacao(roteiro_atual, instrucao)

    response = await client.aio.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
        ),
    )

    return json.loads(response.text)


async def gerar_roteiro(dados: dict) -> dict:
    prompt = montar_prompt(dados)

    response = await client.aio.models.generate_content(
        model="gemini-3-flash-preview", 
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
        )
    )

    return json.loads(response.text)