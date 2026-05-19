import { Sparkles } from "lucide-react";
import { CardHotel } from "@/components/c_roteiro/card_hotel";
import { CardVoo } from "@/components/c_roteiro/card_voo";
import { montarPropsHotel, montarPropsVoo } from "@/lib/helpers/chat_cards";
import type { DadosColetados } from "@/lib/types/chat";

export function RoteiroCards({ dados }: { dados: DadosColetados }) {
  return (
    <>
      {dados.voo_ida_escolhido && typeof dados.voo_ida_escolhido === "object" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardVoo {...montarPropsVoo(dados.voo_ida_escolhido, dados, "Ida")} />
        </div>
      )}

      {dados.voo_volta_escolhido && typeof dados.voo_volta_escolhido === "object" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-4">
          <CardVoo {...montarPropsVoo(dados.voo_volta_escolhido, dados, "Volta")} />
        </div>
      )}

      {dados.hotel_escolhido && typeof dados.hotel_escolhido === "object" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <CardHotel
            {...montarPropsHotel(dados.hotel_escolhido, dados, "Hospedagem Selecionada", [
              "Wi-Fi Grátis",
              "Café da Manhã",
            ])}
          />
        </div>
      )}

      {dados.estilo && (
        <div className="bg-[#FCF3F3] text-[#A63C3C] p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles size={20} />
          <span className="font-semibold text-sm">Estilo da viagem: {dados.estilo}</span>
        </div>
      )}
    </>
  );
}
