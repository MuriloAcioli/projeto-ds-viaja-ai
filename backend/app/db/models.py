from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, default="")
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    itineraries = relationship("Itinerary", back_populates="owner")

class Itinerary(Base):
    __tablename__ = "itineraries"
    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, nullable=False)
    content = Column(JSONB)
    # Metadados da viagem (origem, datas, voos e hotel escolhidos, etc.) usados
    # para reconstruir os cards no Histórico. content guarda só o roteiro.
    trip_data = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="itineraries")
    chat_sessions = relationship("ChatSession", back_populates="itinerary")
    
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, index=True)
    sessao_id = Column(String, unique=True, nullable=False)  # o ID que o frontend usa
    etapa_atual = Column(String, default="destino")
    created_at = Column(DateTime, server_default=func.now())

    itinerary_id = Column(Integer, ForeignKey("itineraries.id"), nullable=True)
    itinerary = relationship("Itinerary", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)   # "user" ou "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    session = relationship("ChatSession", back_populates="messages")