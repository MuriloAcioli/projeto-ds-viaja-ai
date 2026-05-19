from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.db.models import Itinerary, ChatSession, ChatMessage
from app.schemas.chat import MensagemChat, RespostaChat, ItineraryOut, ModificarRoteiro, RespostaModificacao
from app.services.sessao import criar_sessao, obter_sessao, salvar_sessao, deletar_sessao
from app.services.chat_flow import processar_mensagem
from app.ia.llm_client import modificar_roteiro

app = FastAPI(title="ViajaAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/status")
def check_status():
    return {"status": "online", "mensagem": "Servidor do ViajaAI rodando com sucesso!", "versao": "2.0.0"}


@app.post("/api/chat/iniciar")
async def iniciar_chat(db: AsyncSession = Depends(get_db)):
    sessao = criar_sessao()

    # salva a sessao no banco
    chat_session = ChatSession(sessao_id=sessao.sessao_id, etapa_atual="destino")
    db.add(chat_session)
    await db.commit()

    salvar_sessao(sessao)

    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual="destino",
        mensagem_bot="Olá! Bem-vindo ao ViajaAI ✈️\n\nVamos planejar sua viagem dos sonhos!\n\nPrimeiro: qual é o seu destino?",
    )


@app.post("/api/chat/mensagem", response_model=RespostaChat)
async def enviar_mensagem(body: MensagemChat, db: AsyncSession = Depends(get_db)):
    sessao = obter_sessao(body.sessao_id)
    if not sessao:
        raise HTTPException(status_code=404, detail="Sessão não encontrada. Inicie um novo chat.")

    # busca a sessao no banco
    result = await db.execute(
        select(ChatSession).where(ChatSession.sessao_id == body.sessao_id)
    )
    chat_session = result.scalar_one_or_none()

    resposta = await processar_mensagem(sessao, body.mensagem)
    salvar_sessao(sessao)

    # salva as mensagens no banco
    if chat_session:
        db.add(ChatMessage(role="user", content=body.mensagem, session_id=chat_session.id))
        db.add(ChatMessage(role="assistant", content=resposta.mensagem_bot, session_id=chat_session.id))

        # quando o roteiro ficar pronto, salva o itinerário
        if resposta.roteiro:
            itinerary = Itinerary(destination=sessao.destino, content=resposta.roteiro)
            db.add(itinerary)
            await db.flush()  # gera o ID do itinerário antes do commit
            chat_session.itinerary_id = itinerary.id
            chat_session.etapa_atual = resposta.etapa_atual

        await db.commit()

    return resposta


@app.delete("/api/chat/{sessao_id}")
async def encerrar_chat(sessao_id: str, db: AsyncSession = Depends(get_db)):
    deletar_sessao(sessao_id)
    result = await db.execute(select(ChatSession).where(ChatSession.sessao_id == sessao_id))
    chat_session = result.scalar_one_or_none()
    if chat_session:
        chat_session.etapa_atual = "encerrada"
        await db.commit()
    return {"mensagem": "Sessão encerrada."}


@app.get("/api/viagens", response_model=list[ItineraryOut])
async def listar_viagens(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Itinerary))
    return result.scalars().all()


@app.get("/api/viagens/{viagem_id}", response_model=ItineraryOut)
async def obter_viagem(viagem_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Itinerary).where(Itinerary.id == viagem_id))
    viagem = result.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    return viagem


@app.post("/api/viagens/{viagem_id}/modificar", response_model=RespostaModificacao)
async def modificar_viagem(viagem_id: int, body: ModificarRoteiro, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Itinerary).where(Itinerary.id == viagem_id))
    viagem = result.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    if not viagem.content:
        raise HTTPException(status_code=400, detail="Esta viagem não possui roteiro gerado.")

    roteiro_modificado = await modificar_roteiro(viagem.content, body.instrucao)

    viagem.content = roteiro_modificado
    await db.commit()
    await db.refresh(viagem)

    return RespostaModificacao(
        id=viagem.id,
        destination=viagem.destination,
        roteiro=roteiro_modificado,
        mensagem=f"Roteiro de {viagem.destination} atualizado com sucesso! ✏️",
    )


@app.delete("/api/viagens/{viagem_id}")
async def deletar_viagem(viagem_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Itinerary).where(Itinerary.id == viagem_id))
    viagem = result.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    await db.delete(viagem)
    await db.commit()
    return {"mensagem": "Viagem removida do histórico."}