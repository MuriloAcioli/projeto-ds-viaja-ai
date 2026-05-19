import { MapPin } from "lucide-react";

export function HistoricoEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/90 rounded-3xl border border-white/40">
      <MapPin
        className="text-gray-300 mb-4"
        size={48}
        strokeWidth={1}
      />
      <h3 className="text-xl font-semibold text-[#0F2942]">
        Nenhum roteiro ainda
      </h3>
      <p className="text-gray-500 mt-2 text-sm">
        Seus roteiros gerados pelo ViajaAI aparecerão aqui.
      </p>
    </div>
  );
}
