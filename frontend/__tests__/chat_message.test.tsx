import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ChatMessage } from "@/components/c_chat/chat_message";

afterEach(() => {
  cleanup();
});

describe("ChatMessage", () => {
  it("renderiza uma mensagem enviada pelo usuário", () => {
    render(
      <ChatMessage
        mensagem={{
          remetente: "user",
          texto: "Quero viajar para Paris",
        }}
      />
    );

    expect(screen.getByText("Quero viajar para Paris")).toBeDefined();
  });

  it("renderiza uma mensagem enviada pelo bot", () => {
    render(
      <ChatMessage
        mensagem={{
          remetente: "bot",
          texto: "Qual é o seu orçamento?",
        }}
      />
    );

    expect(screen.getByText("Qual é o seu orçamento?")).toBeDefined();
  });
});