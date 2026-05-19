import { Hotel, Star, MapPin, Wifi, Waves, Coffee, Dumbbell, Sparkles, Utensils, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "Wi-Fi Grátis": Wifi,
  "Piscina": Waves,
  "Café da Manhã": Coffee,
  "Academia": Dumbbell,
  "Spa": Sparkles,
  "Restaurante": Utensils,
};

export interface CardHotelProps {
  nome: string;
  estrelas: number;
  categoria: string;
  noites: number;
  precoTotal: string;
  localizacao: string;
  precoNoite: string;
  checkIn: string;
  checkOut: string;
  comodidades: string[];
}

export function CardHotel({
  nome,
  estrelas,
  categoria,
  noites,
  precoTotal,
  localizacao,
  precoNoite,
  checkIn,
  checkOut,
  comodidades
}: CardHotelProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EACFC4] shadow-md p-6 shrink-0 w-full hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FCF3F3] text-[#A63C3C] flex items-center justify-center shrink-0">
            <Hotel size={24} strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2 overflow-hidden"> 
              <h3 className="font-bold text-[#0F2942] text-lg truncate max-w-45" title={nome}>{nome}</h3>
              <div className="flex text-[#A63C3C]">
                {Array.from({ length: estrelas }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400">{categoria}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{noites} noites</p>
          <p className="font-bold text-[#A63C3C] text-xl mt-1">{precoTotal}</p>
        </div>
      </div>

      {/* timeline do hotel */}
      <div className="relative pl-6 border-l-2 border-dotted border-gray-300 ml-3 space-y-6">
        <div className="absolute w-3 h-3 border-2 border-gray-400 rounded-full bg-white -left-[7px] top-1"></div>
        <div>
          <p className="font-bold text-[#0F2942] text-sm flex items-center gap-2">
            <MapPin size={16} className="text-[#A63C3C]"/> {localizacao} <span className="font-normal text-gray-400 text-xs">• {precoNoite}/noite</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Check-in: {checkIn}</p>
        </div>
        <div className="absolute w-3 h-3 border-2 border-gray-400 rounded-full bg-white -left-[7px] bottom-1"></div>
        <div>
          <p className="text-sm text-gray-500">Check-out: {checkOut}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Comodidades Incluídas</p>
        <div className="flex flex-wrap gap-2">
          {comodidades.map((item) => {
            const Icon = ICON_MAP[item] || Sparkles;
            return (
              <div key={item} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs font-medium text-gray-600">
                <Icon size={14}/> {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
