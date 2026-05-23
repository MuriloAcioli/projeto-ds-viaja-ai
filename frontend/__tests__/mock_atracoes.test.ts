import { describe, expect, it } from "vitest";
import {
  ATRACOES,
  CATEGORIES,
  CITIES,
} from "@/lib/data/mockAtracoes";

describe("mockAtracoes", () => {
  it("possui cidades disponíveis para filtro", () => {
    expect(CITIES).toContain("Rio de Janeiro");
    expect(CITIES).toContain("Paris");
    expect(CITIES).toContain("Tóquio");
    expect(CITIES).toContain("Nova York");
  });

  it("possui categoria Todas para limpar o filtro", () => {
    expect(CATEGORIES).toContain("Todas");
  });

  it("possui atrações cadastradas", () => {
    expect(ATRACOES.length).toBeGreaterThan(0);
  });

  it("todas as atrações possuem dados principais preenchidos", () => {
    const todasTemDados = ATRACOES.every((atracao) => {
      return (
        atracao.id &&
        atracao.city &&
        atracao.category &&
        atracao.name &&
        atracao.description &&
        atracao.imageUrl &&
        atracao.location &&
        atracao.hours &&
        atracao.price
      );
    });

    expect(todasTemDados).toBe(true);
  });
});