import { describe, expect, it } from "vitest";
import { montarPropsHotel, montarPropsVoo } from "@/lib/helpers/chat_cards";
import type { DadosColetados, HotelOpcao, VooOpcao } from "@/lib/types/chat";

const dadosBase: DadosColetados = {
  origem: "Recife",
  destino: "Paris",
  pessoas: "2",
  orcamento: "5000",
  datas: "2026-06-10 até 2026-06-20",
  estilo: "Cultural",
  voo_ida_escolhido: null,
  voo_volta_escolhido: null,
  hotel_escolhido: null,
};

describe("montarPropsVoo", () => {
  it("monta os dados básicos de um voo de ida", () => {
    const voo: VooOpcao = {
      preco: 1200,
      escalas: 0,
      partida: "2026-06-10 08:30",
      chegada: "2026-06-10 16:00",
      aeroporto_partida: "REC",
      aeroporto_chegada: "CDG",
      duracao_minutos: 450,
      companhia: "Azul",
      tipo_passagem: "Economy",
      aeronave: "A320",
      numero_voo: "123",
    };

    const resultado = montarPropsVoo(voo, dadosBase, "Ida");

    expect(resultado.tipo).toBe("Ida");
    expect(resultado.preco).toBe("R$ 1200");
    expect(resultado.co2).toBe("Voo Direto");
    expect(resultado.partida.cidade).toBe("Recife");
    expect(resultado.chegada.cidade).toBe("Paris");
    expect(resultado.duracao).toBe("7h 30min");
    expect(resultado.detalhes).toContain("Econômica");
  });
});

describe("montarPropsHotel", () => {
  it("monta os dados básicos de um hotel", () => {
    const hotel: HotelOpcao = {
      nome: "Hotel Teste",
      avaliacao: 4.7,
      preco_noite: "R$ 300",
      thumbnail: "hotel.jpg",
      link: "https://exemplo.com",
    };

    const resultado = montarPropsHotel(hotel, dadosBase);

    expect(resultado.nome).toBe("Hotel Teste");
    expect(resultado.estrelas).toBe(4);
    expect(resultado.precoNoite).toBe("R$ 300");
    expect(resultado.precoTotal).toBe("R$ 1500");
    expect(resultado.localizacao).toBe("Paris");
    expect(resultado.imagemUrl).toBe("hotel.jpg");
  });
});