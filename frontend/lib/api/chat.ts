import type {
  RespostaChatApi,
  RespostaModificacaoApi,
} from "@/lib/types/chat";
import { authHeaders } from "@/lib/api/token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function iniciarChat(): Promise<RespostaChatApi> {
  const res = await fetch(`${API_URL}/api/chat/iniciar`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Falha ao iniciar chat");
  return res.json();
}

export async function enviarMensagemChat(
  sessaoId: string,
  mensagem: string,
): Promise<RespostaChatApi> {
  const res = await fetch(`${API_URL}/api/chat/mensagem`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ sessao_id: sessaoId, mensagem }),
  });

  if (!res.ok) {
    const erro = new Error(`Erro ${res.status}`) as Error & { status?: number };
    erro.status = res.status;
    throw erro;
  }
  return res.json();
}

export async function modificarRoteiro(
  viagemId: number,
  instrucao: string,
): Promise<RespostaModificacaoApi> {
  const res = await fetch(`${API_URL}/api/viagens/${viagemId}/modificar`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ instrucao }),
  });

  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}
