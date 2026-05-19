import { HistoricoEmptyState } from "@/components/c_historico/historico_empty_state";
import { HistoricoHeader } from "@/components/c_historico/historico_header";
import { RoteiroCard } from "@/components/c_historico/roteiro_card";
import { Sidebar } from "@/components/ui/sidebar";
import { ROTEIRO_HISTORICO } from "@/lib/data/mockHistorico";

export default function HistoricoPage() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-y-auto z-10">
        <HistoricoHeader />

        <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-4 pb-20">
          {ROTEIRO_HISTORICO.length === 0 ? (
            <HistoricoEmptyState />
          ) : (
            ROTEIRO_HISTORICO.map((roteiro) => (
              <RoteiroCard key={roteiro.id} roteiro={roteiro} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
