"use client";

import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { CardVoo } from "@/components/c_roteiro/card_voo";
import { HeaderRoteiro } from "@/components/c_roteiro/header";
import { DiaCard } from "@/components/c_historico/dia_card";
import { getStatusStyle } from "@/components/c_historico/status";
import type { RoteiroHistorico } from "@/lib/data/mockHistorico";

export function RoteiroCard({ roteiro }: { roteiro: RoteiroHistorico }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusStyle = getStatusStyle(roteiro.resumo.status);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/50 transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FCF3F3] rounded-2xl flex items-center justify-center text-[#A63C3C] shrink-0">
            <MapPin size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F2942]">
              {roteiro.resumo.destino}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {roteiro.resumo.data}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyle}`}
              >
                {roteiro.resumo.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <span className="text-sm font-medium hidden sm:block">
            {isExpanded ? "Ocultar detalhes" : "Ver roteiro completo"}
          </span>
          <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm text-[#0F2942]">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-white/15">
          <HeaderRoteiro {...roteiro.header} />

          <div className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <CardVoo {...roteiro.voos.ida} />
              <CardVoo {...roteiro.voos.volta} />
            </div>

            <CardHotel {...roteiro.hotel} />

            <DiaCard titulo={roteiro.dia1Titulo} data={roteiro.dia1Data} />
            <DiaCard
              titulo={roteiro.ultimoDiaTitulo}
              data={roteiro.UltimoDiaData}
            />
          </div>
        </div>
      )}
    </div>
  );
}
