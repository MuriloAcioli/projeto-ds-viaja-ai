import { Compass } from "lucide-react";

export function RoteiroVazio() {
  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 items-center justify-center p-10 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-inner">
        <Compass size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-[#0F2942] mb-2">Seu roteiro ganha vida aqui</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        Comece a interagir com o ViajaAI. Conforme conversamos, esta página será desenhada sob medida para você.
      </p>
    </div>
  );
}
