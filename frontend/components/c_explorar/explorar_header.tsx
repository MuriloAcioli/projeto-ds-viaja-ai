import { Search } from "lucide-react";

export function ExplorarHeader() {
  return (
    <header className="w-full bg-white/50 backdrop-blur-md border-b border-white/40 px-8 py-6 sticky top-0 z-20">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-bold text-[#0F2942] text-2xl">
            Descobrir Destinos
          </h1>
          <p className="text-sm text-gray-700 font-medium">
            Inspirações para a sua próxima viagem
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Procurar destinos, pontos turísticos..."
            className="w-full md:w-80 pl-11 pr-4 py-3 rounded-full bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#D68585]/50 text-sm shadow-sm placeholder:text-gray-500 text-[#0F2942]"
            readOnly
          />
        </div>
      </div>
    </header>
  );
}
