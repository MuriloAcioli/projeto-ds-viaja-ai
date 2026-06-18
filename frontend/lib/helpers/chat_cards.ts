import { formatarDataExtenso, formatarDuracao } from "@/lib/utils";
import type {
  DadosColetados,
  HotelOpcao,
  PropsHotelMontadas,
  PropsVooMontadas,
  VooOpcao,
} from "@/lib/types/chat";

function getDataVoo(dados: DadosColetados, isIda: boolean) {
  const [dataIda, dataVolta] = dados.datas?.split(" até ") ?? ["", ""];
  return formatarDataExtenso(isIda ? dataIda || "" : dataVolta || dataIda || "");
}

function traduzirTipoPassagem(tipo?: string) {
  const tipos: Record<string, string> = {
    Economy: "Econômica",
    "Premium economy": "Econômica premium",
    Business: "Executiva",
    First: "Primeira classe",
  };

  return tipo ? tipos[tipo] || tipo : "";
}

function montarDetalhesVoo(voo: VooOpcao) {
  return [
    voo.companhia,
    traduzirTipoPassagem(voo.tipo_passagem),
    voo.aeronave,
    voo.numero_voo ? `Voo ${voo.numero_voo}` : "",
  ]
    .filter(Boolean)
    .join(" • ");
}

export function montarPropsVoo(
  voo: VooOpcao,
  dados: DadosColetados,
  tipo: "Ida" | "Volta",
): PropsVooMontadas {
  const isIda = tipo === "Ida";

  return {
    tipo,
    data: getDataVoo(dados, isIda),
    preco: `R$ ${voo.preco}`,
    co2: voo.escalas === 0 ? "Voo Direto" : `${voo.escalas} escala(s)`,
    partida: {
      hora: voo.partida?.split(" ")[1] || voo.partida || (isIda ? "08:00" : "14:00"),
      aeroporto: voo.aeroporto_partida || "Origem",
      cidade: isIda ? dados.origem : dados.destino,
    },
    chegada: {
      hora: voo.chegada?.split(" ")[1] || voo.chegada || (isIda ? "12:00" : "18:00"),
      aeroporto: voo.aeroporto_chegada || "Destino",
      cidade: isIda ? dados.destino : dados.origem,
    },
    duracao: formatarDuracao(voo.duracao_minutos || 0),
    detalhes: montarDetalhesVoo(voo),
    logoCompanhia: voo.logo_companhia,
    linkPassagem: voo.link_passagem,
  };
}

export function montarPropsHotel(
  hotel: HotelOpcao,
  dados: DadosColetados,
  categoria = "Hospedagem",
  comodidades = ["Wi-Fi", "Café"],
): PropsHotelMontadas {
  return {
    nome: hotel.nome || "",
    estrelas: Math.floor(hotel.avaliacao || 4),
    categoria,
    noites: 5,
    precoTotal: `R$ ${parseInt(hotel.preco_noite?.replace(/\D/g, "") || "0") * 5}`,
    localizacao: dados.destino,
    precoNoite: hotel.preco_noite || "",
    checkIn: "14:00",
    checkOut: "12:00",
    comodidades,
    imagemUrl: hotel.imagem_url || hotel.thumbnail || hotel.foto_url || hotel.image,
    linkHotel: hotel.link_hotel,
  };
}
