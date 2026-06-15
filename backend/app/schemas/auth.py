from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    nome: str
    email: str
    senha: str


class UserLogin(BaseModel):
    email: str
    senha: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    nome: str
    email: str

    class Config:
        from_attributes = True


# Resolve forward reference
TokenResponse.model_rebuild()
