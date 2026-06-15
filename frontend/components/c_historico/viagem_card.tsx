"use client";

import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, MapPin, Trash2 } from "lucide-react";
import { RoteiroCards } from "@/components/c_roteiro/roteiro_cards";
import { RoteiroAtividades } from "@/components/c_roteiro/roteiro_atividades";
import { getStatusStyle } from "@/components/c_historico/status";
import { formatarDataExtenso } from "@/lib/utils";
import type { DadosColetados } from "@/lib/types/chat";
import type { TripData, Viagem } from "@/lib/api/viagens";

function construirDados(viagem: Viagem): DadosColetados {
  const t = viagem.trip_data;
  const datas = t?.data_ida
    ? t.data_volta
      ? `${t.data_ida} até ${t.data_volta}`
      : t.data_ida
    : "";

  return {
    destino: t?.destino ?? viagem.destination,
    origem: t?.origem ?? "",
    pessoas: t?.num_pessoas != null ? String(t.num_pessoas) : "",
    orcamento: t?.orcamento != null ? String(t.orcamento) : "",
    datas,
    estilo: t?.estilo ?? "",
    voo_ida_escolhido: t?.voo_ida ?? null,
    voo_volta_escolhido: t?.voo_volta ?? null,
    hotel_escolhido: t?.hotel ?? null,
  };
}

function calcularStatus(t: TripData | null): string {
  if (t?.data_volta) {
    const volta = new Date(`${t.data_volta}T12:00:00`);
    if (!Number.isNaN(volta.getTime()) && volta < new Date()) return "Concluída";
  }
  return "Planejada";
}

export function ViagemCard({
  viagem,
  onDelete,
}: {
  viagem: Viagem;
  onDelete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const dados = construirDados(viagem);
  const status = calcularStatus(viagem.trip_data);
  const statusStyle = getStatusStyle(status);
  const dataLabel = dados.datas
    ? formatarDataExtenso(dados.datas)
    : new Date(viagem.created_at).toLocaleDateString("pt-BR");

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
              {viagem.destination}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {dataLabel}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyle}`}
              >
                {status}
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
          <div className="p-6 flex flex-col gap-6">
            <RoteiroCards dados={dados} />
            <RoteiroAtividades roteiroIa={viagem.content} />

            <button
              onClick={onDelete}
              className="self-end inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} /> Remover do histórico
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
