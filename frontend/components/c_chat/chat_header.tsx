import { Sparkles } from "lucide-react";
import type { RoteiroIa } from "@/lib/types/chat";

export function ChatHeader({ roteiroIa }: { roteiroIa: RoteiroIa | null }) {
  return (
    <header className="p-6 border-b flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#0F2942]">
        <Sparkles size={24} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold text-[#0F2942] text-xl">Novo Chat</h2>
        <p className="text-sm text-gray-400">
          {roteiroIa
            ? "Roteiro gerado com sucesso ✅"
            : "Itinerário em progresso"}
        </p>
      </div>
    </header>
  );
}
