// Mesma chave usada pelo AuthProvider (useAuth) para guardar o JWT.
const TOKEN_KEY = "viaja_ai_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/** Monta os headers de uma requisição autenticada, incluindo o Bearer token. */
export function authHeaders(
  extra?: Record<string, string>,
): Record<string, string> {
  const token = getToken();
  return {
    ...(extra ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
