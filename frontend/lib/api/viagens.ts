import { authHeaders } from "@/lib/api/token";
import type { HotelOpcao, RoteiroIa, VooOpcao } from "@/lib/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TripData {
  destino?: string;
  origem?: string;
  data_ida?: string | null;
  data_volta?: string | null;
  num_pessoas?: number | null;
  orcamento?: number | null;
  estilo?: string | null;
  voo_ida?: VooOpcao | null;
  voo_volta?: VooOpcao | null;
  hotel?: HotelOpcao | null;
}

export interface Viagem {
  id: number;
  destination: string;
  content: RoteiroIa | null;
  trip_data: TripData | null;
  created_at: string;
}

export async function listarViagens(): Promise<Viagem[]> {
  const res = await fetch(`${API_URL}/api/viagens`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export async function deletarViagem(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/viagens/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
}
