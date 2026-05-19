import type { RespostaChatApi } from "@/lib/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function iniciarChat(): Promise<RespostaChatApi> {
  const res = await fetch(`${API_URL}/api/chat/iniciar`, {
    method: "POST",
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessao_id: sessaoId, mensagem }),
  });

  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}
