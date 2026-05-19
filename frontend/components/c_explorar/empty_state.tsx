import { Compass } from "lucide-react";

export function EmptyState({ city }: { city: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/90 backdrop-blur-sm rounded-3xl border border-white/40">
      <Compass className="text-gray-400 mb-4" size={48} strokeWidth={1} />
      <h3 className="text-xl font-semibold text-[#0F2942]">
        Nenhum local encontrado
      </h3>
      <p className="text-gray-600 mt-2">
        Ainda estamos mapeando locais nesta categoria para {city}.
      </p>
    </div>
  );
}
