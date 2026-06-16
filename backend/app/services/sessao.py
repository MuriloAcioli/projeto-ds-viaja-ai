import uuid
import json
import logging
import os

import redis.asyncio as aioredis
from app.schemas.chat import SessaoViagem

logger = logging.getLogger(__name__)

# TTL de 2 horas — tempo máximo para o usuário completar o fluxo do chat.
# Se a sessão ficar inativa por mais tempo, expira automaticamente no Redis.
_SESSAO_TTL_SEGUNDOS = 60 * 60 * 2

_redis: aioredis.Redis | None = None


def _get_redis() -> aioredis.Redis:
    """Retorna (ou cria) a conexão singleton com o Redis."""
    global _redis
    if _redis is None:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        logger.info("Conectando ao Redis: %s", redis_url[:30] + "...")
        # ssl_cert_reqs=None é necessário para provedores como Upstash (rediss://)
        # que usam TLS mas cujo certificado pode não ser validável em todos os ambientes.
        import ssl as _ssl
        _redis = aioredis.from_url(
            redis_url,
            decode_responses=True,
            ssl_cert_reqs=_ssl.CERT_NONE if redis_url.startswith("rediss://") else None,
        )
    return _redis


def _chave(sessao_id: str) -> str:
    return f"sessao:{sessao_id}"


# ---------------------------------------------------------------------------
# API pública — mesmas assinaturas do módulo anterior, agora assíncronas
# ---------------------------------------------------------------------------

def criar_sessao() -> SessaoViagem:
    """
    Cria e retorna uma SessaoViagem com UUID gerado.
    A persistência no Redis é feita por salvar_sessao(), chamada
    logo em seguida em main.py, mantendo a função síncrona para
    não quebrar o fluxo de inicialização do endpoint.
    """
    sessao_id = str(uuid.uuid4())
    return SessaoViagem(sessao_id=sessao_id)


async def obter_sessao(sessao_id: str) -> SessaoViagem | None:
    """Busca a sessão no Redis e desserializa para SessaoViagem."""
    try:
        raw = await _get_redis().get(_chave(sessao_id))
        if raw is None:
            return None
        return SessaoViagem.model_validate(json.loads(raw))
    except Exception:
        logger.exception("Erro ao obter sessão %s do Redis", sessao_id)
        return None


async def salvar_sessao(sessao: SessaoViagem) -> None:
    """Serializa e persiste a sessão no Redis, renovando o TTL."""
    try:
        await _get_redis().set(
            _chave(sessao.sessao_id),
            sessao.model_dump_json(),
            ex=_SESSAO_TTL_SEGUNDOS,
        )
    except Exception:
        logger.exception("Erro ao salvar sessão %s no Redis", sessao.sessao_id)


async def deletar_sessao(sessao_id: str) -> None:
    """Remove a sessão do Redis ao encerrar o chat."""
    try:
        await _get_redis().delete(_chave(sessao_id))
    except Exception:
        logger.exception("Erro ao deletar sessão %s do Redis", sessao_id)