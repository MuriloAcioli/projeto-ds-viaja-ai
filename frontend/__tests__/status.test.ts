import { describe, expect, it } from "vitest";
import { getStatusStyle } from "@/components/c_historico/status";

describe("getStatusStyle", () => {
  it("retorna estilo azul para viagem planejada", () => {
    expect(getStatusStyle("Planejada")).toContain("bg-blue-50");
  });

  it("retorna estilo verde para viagem concluída", () => {
    expect(getStatusStyle("Concluída")).toContain("bg-green-50");
  });

  it("retorna estilo cinza para status desconhecido", () => {
    expect(getStatusStyle("Cancelada")).toContain("bg-gray-100");
  });
});