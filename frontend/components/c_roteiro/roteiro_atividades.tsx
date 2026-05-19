import { CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { formatarDataExtenso } from "@/lib/utils";
import type { RoteiroIa } from "@/lib/types/chat";

export function RoteiroAtividades({ roteiroIa }: { roteiroIa: RoteiroIa | null }) {
  if (!roteiroIa) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-2">
      <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-3">
        <Sparkles size={20} />
        {roteiroIa.resumo}
      </div>

      {roteiroIa.dias?.map((dia, index) => (
        <div key={index} className="bg-white/80 p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start cursor-pointer group">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#A63C3C]" size={28} strokeWidth={2} />
                <h3 className="text-[#A63C3C] text-xl font-bold group-hover:underline">
                  Dia {dia.dia} — {dia.titulo}
                </h3>
              </div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-10">
                {formatarDataExtenso(dia.data || "")} • {dia.clima_dia}
              </p>
            </div>
            <ChevronDown className="text-gray-400 mt-2" />
          </div>

          <div className="relative ml-3.5 border-l-2 border-[#FCF3F3] mt-4 pl-6 py-2 flex flex-col gap-6">
            {dia.atividades?.map((ativ, i) => (
              <div key={i} className="relative flex gap-4 group">
                <div className="absolute -left-[31px] top-[6px] w-2 h-2 rounded-full bg-[#EACFC4] group-hover:bg-[#A63C3C] transition-colors"></div>

                <span className="text-sm font-bold text-gray-400 shrink-0 w-12 pt-0.5">{ativ.horario}</span>
                <div>
                  <p className="font-bold text-[#0F2942] text-[15px] leading-tight">{ativ.nome}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{ativ.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
