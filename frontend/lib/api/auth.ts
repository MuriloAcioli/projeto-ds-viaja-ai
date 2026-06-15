const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserOut {
  id: number;
  nome: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserOut;
}

export async function registrarUsuario(
  nome: string,
  email: string,
  senha: string,
): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/api/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || `Erro ${res.status}`);
  }

  return res.json();
}

export async function loginUsuario(
  email: string,
  senha: string,
): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || `Erro ${res.status}`);
  }

  return res.json();
}

export async function obterUsuarioAtual(token: string): Promise<UserOut> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Token inválido");
  }

  return res.json();
}
