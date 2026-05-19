import { RoteiroAtividades } from "@/components/c_roteiro/roteiro_atividades";
import { RoteiroCabecalho } from "@/components/c_roteiro/roteiro_cabecalho";
import { RoteiroCards } from "@/components/c_roteiro/roteiro_cards";
import { RoteiroVazio } from "@/components/c_roteiro/roteiro_vazio";
import type { DadosColetados, RoteiroIa } from "@/lib/types/chat";

export function RoteiroDinamico({
  dados,
  roteiroIa,
}: {
  dados: DadosColetados;
  roteiroIa: RoteiroIa | null;
}) {
  const comecou = dados.destino !== "";

  if (!comecou) {
    return <RoteiroVazio />;
  }

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 overflow-hidden">
      <RoteiroCabecalho dados={dados} />

      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        <RoteiroCards dados={dados} />
        <RoteiroAtividades roteiroIa={roteiroIa} />
      </div>
    </div>
  );
}
