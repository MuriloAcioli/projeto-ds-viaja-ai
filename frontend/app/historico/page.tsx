"use client";

import { useEffect, useState } from "react";
import { HistoricoEmptyState } from "@/components/c_historico/historico_empty_state";
import { HistoricoHeader } from "@/components/c_historico/historico_header";
import { ViagemCard } from "@/components/c_historico/viagem_card";
import { RequireAuth } from "@/components/auth/require_auth";
import { Sidebar } from "@/components/ui/sidebar";
import { deletarViagem, listarViagens, type Viagem } from "@/lib/api/viagens";

export default function HistoricoPage() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    listarViagens()
      .then(setViagens)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, []);

  async function handleDelete(id: number) {
    try {
      await deletarViagem(id);
      setViagens((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Erro ao remover viagem:", err);
    }
  }

  return (
    <RequireAuth>
      <div className="relative flex h-screen w-full overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">
          <HistoricoHeader />

          <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-4 pb-20">
            {carregando ? (
              <p className="text-center text-gray-500 py-10">
                Carregando suas viagens…
              </p>
            ) : erro ? (
              <p className="text-center text-gray-500 py-10">
                Não foi possível carregar seu histórico. Tente novamente mais
                tarde.
              </p>
            ) : viagens.length === 0 ? (
              <HistoricoEmptyState />
            ) : (
              viagens.map((viagem) => (
                <ViagemCard
                  key={viagem.id}
                  viagem={viagem}
                  onDelete={() => handleDelete(viagem.id)}
                />
              ))
            )}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
