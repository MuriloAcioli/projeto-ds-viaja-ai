import Image from "next/image";
import { Plane, Wifi, BatteryCharging, Tv } from "lucide-react";

export interface CardVooProps {
  tipo: "Ida" | "Volta";
  data: string;
  preco: string;
  co2: string; // Espera-se "181kg de CO²"
  partida: { hora: string; aeroporto: string; cidade: string };
  chegada: { hora: string; aeroporto: string; cidade: string };
  duracao: string;
  detalhes: string;
  logoCompanhia?: string;
}

export function CardVoo({ tipo, data, preco, co2, partida, duracao, detalhes, chegada, logoCompanhia }: CardVooProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EACFC4] shadow-md p-6 w-full hover:shadow-lg transition-shadow">
      {/* Header do Card */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FCF3F3] text-[#A63C3C] flex items-center justify-center shrink-0">
            {logoCompanhia ? (
              <Image
                src={logoCompanhia}
                alt="Logo da companhia aérea"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Plane size={24} strokeWidth={1.5} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-[#0F2942] text-lg">Voo de {tipo}</h3>
            <p className="text-sm text-gray-400">{data}</p>
          </div>
        </div>
        <div className="text-right">
          {/* Emissões no formato solicitado */}
          <p className="text-xs text-gray-400 leading-tight">
            Estimativa: {co2} <br/>
            <span className="text-[10px]">estimativa média ⓘ</span>
          </p>
          {/* Preço em Destaque Vermelho */}
          <p className="font-bold text-[#A63C3C] text-xl mt-1">{preco}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
        <div className="relative pl-8 flex flex-col gap-5">
          {/* Linha Pontilhada Lateral */}
          <div className="absolute left-[11px] top-[10px] bottom-[10px] border-l-2 border-dotted border-gray-300"></div>

          {/* Partida */}
          <div className="relative flex flex-col">
            <div className="absolute -left-[26px] top-[4px] w-3 h-3 border-2 border-gray-400 rounded-full bg-white z-10"></div>
            <p className="font-bold text-[#0F2942] text-sm leading-tight">
              {partida.hora} • {partida.aeroporto}
            </p>
          </div>

          {/* Informações de Meio (Compactas) */}
          <div className="text-[11px] text-gray-400 font-medium ml-1">
            <p>Tempo de viagem: {duracao}</p>
            <p>{detalhes}</p>
          </div>

          {/* Chegada */}
          <div className="relative flex flex-col">
            <div className="absolute -left-[26px] top-[4px] w-3 h-3 border-2 border-gray-400 rounded-full bg-white z-10"></div>
            <p className="font-bold text-[#0F2942] text-sm leading-tight">
              {chegada.hora} • {chegada.aeroporto}
            </p>
          </div>
        </div>
        
        {/* Comodidades Lateral */}
        <div className="flex flex-col gap-2 text-[11px] text-gray-500 font-medium justify-center md:border-l md:border-gray-100 md:pl-6">
          <div className="flex items-center gap-2"><Wifi size={14} /> Wi-Fi cobrado à parte</div>
          <div className="flex items-center gap-2"><BatteryCharging size={14} /> Saída USB</div>
          <div className="flex items-center gap-2"><Tv size={14} /> Streaming no dispositivo</div>
        </div>
      </div>
    </div>
  );
}
