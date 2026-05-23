import { describe, expect, it } from "vitest";
import { formatarDuracao } from "@/lib/utils";

describe("formatarDuracao", () => {
  it("retorna string vazia quando os minutos são 0", () => {
    expect(formatarDuracao(0)).toBe("");
  });

  it("formata duração menor que uma hora", () => {
    expect(formatarDuracao(45)).toBe("45min");
  });

  it("formata duração com horas e minutos", () => {
    expect(formatarDuracao(90)).toBe("1h 30min");
  });

  it("formata duração com horas exatas", () => {
    expect(formatarDuracao(120)).toBe("2h");
  });
});