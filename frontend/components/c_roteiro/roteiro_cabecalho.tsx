import React from "react";
import { Clock, CreditCard, MapPin, Users } from "lucide-react";
import type { DadosColetados } from "@/lib/types/chat";

export function RoteiroCabecalho({ dados }: { dados: DadosColetados }) {
  const itensCabecalho = [
    dados.datas ? { icone: <Clock size={16} />, texto: dados.datas } : null,
    dados.orcamento ? { icone: <CreditCard size={16} />, texto: `R$ ${dados.orcamento}` } : null,
    dados.pessoas ? { icone: <Users size={16} />, texto: `${dados.pessoas} pessoa(s)` } : null,
    dados.origem ? { icone: <MapPin size={16} />, texto: `${dados.origem} - ${dados.destino}` } : null,
  ].filter(Boolean);

  return (
    <header className="p-6 border-b border-white/40 bg-white/40 flex flex-col gap-4">
      <h2 className="font-bold text-[#0F2942] text-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        {dados.destino}
      </h2>

      <div className="flex flex-wrap items-center gap-3 text-sm text-[#5B738B] font-medium">
        {itensCabecalho.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
              {item?.icone} {item?.texto}
            </div>
            {index < itensCabecalho.length - 1 && (
              <span className="text-gray-300 animate-in fade-in duration-500">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </header>
  );
}
