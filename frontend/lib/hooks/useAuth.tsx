"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginUsuario,
  obterUsuarioAtual,
  registrarUsuario,
  type UserOut,
} from "@/lib/api/auth";

interface AuthContextType {
  user: UserOut | null;
  token: string | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registro: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "viaja_ai_token";
const USER_KEY = "viaja_ai_user";

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Ensure cookie is in sync with localStorage
      setCookie(TOKEN_KEY, storedToken, 1);

      // Validate token in background
      obterUsuarioAtual(storedToken)
        .then((u) => {
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          deleteCookie(TOKEN_KEY);
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      deleteCookie(TOKEN_KEY);
      setLoading(false);
    }
  }, []);

  const saveSession = useCallback((accessToken: string, userData: UserOut) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setCookie(TOKEN_KEY, accessToken, 1); // 1 day, matching JWT expiry
    setToken(accessToken);
    setUser(userData);
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      const response = await loginUsuario(email, senha);
      saveSession(response.access_token, response.user);
    },
    [saveSession],
  );

  const registro = useCallback(
    async (nome: string, email: string, senha: string) => {
      const response = await registrarUsuario(nome, email, senha);
      saveSession(response.access_token, response.user);
    },
    [saveSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    deleteCookie(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, registro, logout }),
    [user, token, loading, login, registro, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
