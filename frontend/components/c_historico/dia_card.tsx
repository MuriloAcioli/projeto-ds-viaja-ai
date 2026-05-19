import { CheckCircle2, ChevronDown } from "lucide-react";

export function DiaCard({ titulo, data }: { titulo: string; data: string }) {
  return (
    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CheckCircle2
            className="text-[#A63C3C] shrink-0"
            size={28}
            strokeWidth={2}
          />
          <h3 className="text-[#A63C3C] text-xl font-bold">{titulo}</h3>
        </div>
        <ChevronDown className="text-gray-400" />
      </div>
      <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2 ml-10">
        {data}
      </p>
      <div className="ml-3.5 border-l-2 border-[#FCF3F3] h-20 mt-4" />
    </div>
  );
}
