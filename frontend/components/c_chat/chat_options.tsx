import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { CardVoo } from "@/components/c_roteiro/card_voo";
import { montarPropsHotel, montarPropsVoo } from "@/lib/helpers/chat_cards";
import type { DadosColetados, OpcoesObjetos } from "@/lib/types/chat";

interface ChatOptionsProps {
  opcoes: string[];
  carregando: boolean;
  etapaAtual: string;
  opcoesObjetos: OpcoesObjetos;
  dadosColetados: DadosColetados;
  enviarMensagem: (texto: string) => void;
}

export function ChatOptions({
  opcoes,
  carregando,
  etapaAtual,
  opcoesObjetos,
  dadosColetados,
  enviarMensagem,
}: ChatOptionsProps) {
  if (opcoes.length === 0 || carregando) return null;

  return (
    <div
      className={`flex gap-4 mt-2 overflow-x-auto py-4 px-1 custom-scrollbar shrink-0 ${
        opcoesObjetos.voos || opcoesObjetos.hoteis
          ? "flex-nowrap items-stretch"
          : "flex-wrap items-center"
      }`}
    >
      {opcoes.map((opcao, idx) => {
        if (
          (etapaAtual === "voo_ida" || etapaAtual === "voo_volta") &&
          opcoesObjetos.voos
        ) {
          const v = opcoesObjetos.voos[idx];
          if (!v) return null;
          const tipo = etapaAtual === "voo_ida" ? "Ida" : "Volta";

          return (
            <div
              key={idx}
              onClick={() => enviarMensagem(opcao)}
              className="cursor-pointer min-w-[320px] transition-transform hover:-translate-y-1 active:scale-95 shrink-0"
            >
              <CardVoo {...montarPropsVoo(v, dadosColetados, tipo)} />
            </div>
          );
        }

        if (etapaAtual === "hoteis" && opcoesObjetos.hoteis) {
          const h = opcoesObjetos.hoteis[idx];
          if (!h) return null;

          return (
            <div
              key={idx}
              onClick={() => enviarMensagem(opcao)}
              className="cursor-pointer min-w-[320px] transition-transform hover:-translate-y-1 active:scale-95 shrink-0"
            >
              <CardHotel {...montarPropsHotel(h, dadosColetados)} />
            </div>
          );
        }

        return (
          <div
            key={opcao}
            onClick={() => enviarMensagem(opcao)}
            className="cursor-pointer flex items-center justify-center px-5 py-2.5 rounded-full border border-[#F2D6D6] bg-[#FCF3F3] text-[#A63C3C] text-sm font-bold hover:bg-[#F8E8E8] shadow-sm transition-transform active:scale-95 shrink-0 whitespace-nowrap"
          >
            {opcao}
          </div>
        );
      })}
    </div>
  );
}
