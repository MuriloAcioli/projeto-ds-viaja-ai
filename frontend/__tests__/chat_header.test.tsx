import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ChatHeader } from "@/components/c_chat/chat_header";
import type { RoteiroIa } from "@/lib/types/chat";

afterEach(() => {
  cleanup();
});

describe("ChatHeader", () => {
  it("mostra que o roteiro está em progresso quando ainda não existe roteiro", () => {
    render(<ChatHeader roteiroIa={null} />);

    expect(screen.getByText("Novo Chat")).toBeDefined();
    expect(screen.getByText("Itinerário em progresso")).toBeDefined();
  });

  it("mostra mensagem de sucesso quando já existe roteiro", () => {
    const roteiro = {} as RoteiroIa;

    render(<ChatHeader roteiroIa={roteiro} />);

    expect(screen.getByText("Roteiro gerado com sucesso ✅")).toBeDefined();
  });
});