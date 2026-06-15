from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.db.models import User, Itinerary, ChatSession, ChatMessage
from app.schemas.chat import MensagemChat, RespostaChat, ItineraryOut, ModificarRoteiro, RespostaModificacao
from app.schemas.auth import UserCreate, UserLogin, TokenResponse, UserOut
from app.schemas.explorar import RespostaDestinos, RespostaAtracoes
from app.services.sessao import criar_sessao, obter_sessao, salvar_sessao, deletar_sessao
from app.services.chat_flow import processar_mensagem
from app.services.explorar import listar_destinos, buscar_atracoes_por_cidade
from app.services.auth import hash_password, verify_password, create_access_token, get_current_user
from app.ia.llm_client import modificar_roteiro

app = FastAPI(title="ViajaAI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Status
# ---------------------------------------------------------------------------

@app.get("/api/status")
def check_status():
    return {"status": "online", "mensagem": "Servidor do ViajaAI rodando com sucesso!", "versao": "2.0.0"}


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@app.post("/api/auth/registro", response_model=TokenResponse)
async def registrar_usuario(body: UserCreate, db: AsyncSession = Depends(get_db)):
    # Verificar se o email já está em uso
    result = await db.execute(select(User).where(User.email == body.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=409, detail="Este e-mail já está cadastrado.")

    # Criar o usuário
    user = User(
        nome=body.nome,
        email=body.email,
        hashed_password=hash_password(body.senha),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Gerar token
    token = create_access_token(user.id, user.email)
    return TokenResponse(
        access_token=token,
        user=UserOut(id=user.id, nome=user.nome, email=user.email),
    )


@app.post("/api/auth/login", response_model=TokenResponse)
async def login_usuario(body: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.senha, user.hashed_password):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    token = create_access_token(user.id, user.email)
    return TokenResponse(
        access_token=token,
        user=UserOut(id=user.id, nome=user.nome, email=user.email),
    )


@app.get("/api/auth/me", response_model=UserOut)
async def usuario_atual(user: User = Depends(get_current_user)):
    return UserOut(id=user.id, nome=user.nome, email=user.email)


@app.post("/api/auth/logout")
async def logout_usuario(user: User = Depends(get_current_user)):
    # JWT é stateless: o cliente descarta o token. O endpoint apenas valida
    # a sessão atual e confirma o encerramento.
    return {"mensagem": "Logout realizado com sucesso."}


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

@app.post("/api/chat/iniciar")
async def iniciar_chat(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    sessao = criar_sessao()

    chat_session = ChatSession(sessao_id=sessao.sessao_id, etapa_atual="destino")
    db.add(chat_session)
    await db.commit()

    await salvar_sessao(sessao)

    return RespostaChat(
        sessao_id=sessao.sessao_id,
        etapa_atual="destino",
        mensagem_bot="Olá! Bem-vindo ao ViajaAI ✈️\n\nVamos planejar sua viagem dos sonhos!\n\nPrimeiro: qual é o seu destino?",
    )


@app.post("/api/chat/mensagem", response_model=RespostaChat)
async def enviar_mensagem(
    body: MensagemChat,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    sessao = await obter_sessao(body.sessao_id)
    if not sessao:
        raise HTTPException(status_code=404, detail="Sessão não encontrada. Inicie um novo chat.")

    result = await db.execute(
        select(ChatSession).where(ChatSession.sessao_id == body.sessao_id)
    )
    chat_session = result.scalar_one_or_none()

    resposta = await processar_mensagem(sessao, body.mensagem)
    await salvar_sessao(sessao)

    if chat_session:
        db.add(ChatMessage(role="user", content=body.mensagem, session_id=chat_session.id))
        db.add(ChatMessage(role="assistant", content=resposta.mensagem_bot, session_id=chat_session.id))

        if resposta.roteiro:
            itinerary = Itinerary(
                destination=sessao.destino,
                content=resposta.roteiro,
                user_id=user.id,
                trip_data={
                    "destino": sessao.destino,
                    "origem": sessao.origem,
                    "data_ida": sessao.data_ida,
                    "data_volta": sessao.data_volta,
                    "num_pessoas": sessao.num_pessoas,
                    "orcamento": sessao.orcamento,
                    "estilo": sessao.estilo,
                    "voo_ida": sessao.voo_ida_escolhido,
                    "voo_volta": sessao.voo_volta_escolhido,
                    "hotel": sessao.hotel_escolhido,
                },
            )
            db.add(itinerary)
            await db.flush()
            chat_session.itinerary_id = itinerary.id
            chat_session.etapa_atual = resposta.etapa_atual
            resposta.itinerary_id = itinerary.id

        await db.commit()

    return resposta


@app.delete("/api/chat/{sessao_id}")
async def encerrar_chat(
    sessao_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await deletar_sessao(sessao_id)
    result = await db.execute(select(ChatSession).where(ChatSession.sessao_id == sessao_id))
    chat_session = result.scalar_one_or_none()
    if chat_session:
        chat_session.etapa_atual = "encerrada"
        await db.commit()
    return {"mensagem": "Sessão encerrada."}


# ---------------------------------------------------------------------------
# Viagens
# ---------------------------------------------------------------------------

async def _obter_viagem_do_usuario(viagem_id: int, db: AsyncSession, user: User) -> Itinerary:
    """Busca um itinerário garantindo que ele pertence ao usuário autenticado."""
    result = await db.execute(
        select(Itinerary).where(
            Itinerary.id == viagem_id,
            Itinerary.user_id == user.id,
        )
    )
    viagem = result.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada.")
    return viagem


@app.get("/api/viagens", response_model=list[ItineraryOut])
async def listar_viagens(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Itinerary)
        .where(Itinerary.user_id == user.id)
        .order_by(Itinerary.created_at.desc())
    )
    return result.scalars().all()


@app.get("/api/viagens/{viagem_id}", response_model=ItineraryOut)
async def obter_viagem(
    viagem_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await _obter_viagem_do_usuario(viagem_id, db, user)


@app.post("/api/viagens/{viagem_id}/modificar", response_model=RespostaModificacao)
async def modificar_viagem(
    viagem_id: int,
    body: ModificarRoteiro,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    viagem = await _obter_viagem_do_usuario(viagem_id, db, user)
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
async def deletar_viagem(
    viagem_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    viagem = await _obter_viagem_do_usuario(viagem_id, db, user)
    await db.delete(viagem)
    await db.commit()
    return {"mensagem": "Viagem removida do histórico."}


# ---------------------------------------------------------------------------
# Explorar
# ---------------------------------------------------------------------------

@app.get("/api/explorar/destinos", response_model=RespostaDestinos)
async def listar_destinos_explorar():
    """
    Retorna a lista de cidades disponíveis, categorias de interesse
    e metadados dos destinos populares para montar os filtros da tela /explorar.
    """
    cities, categories, destinos = await listar_destinos()
    return RespostaDestinos(cities=cities, categories=categories, destinos=destinos)


@app.get("/api/explorar/atracoes/{cidade}", response_model=RespostaAtracoes)
async def listar_atracoes_por_cidade(cidade: str):
    """
    Retorna atrações de uma cidade específica.
    Tenta o TripAdvisor primeiro; usa a lista curada como fallback automático.
    """
    atracoes = await buscar_atracoes_por_cidade(cidade)
    if not atracoes:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhuma atração encontrada para '{cidade}'.",
        )
    return RespostaAtracoes(city=cidade, atracoes=atracoes)