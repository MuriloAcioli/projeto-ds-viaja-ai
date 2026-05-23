import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ChatInput } from "@/components/c_chat/chat_input";

afterEach(() => {
  cleanup();
});

describe("ChatInput", () => {
  it("renderiza o placeholder padrão quando não há roteiro", () => {
    render(
      <ChatInput
        input=""
        setInput={() => {}}
        carregando={false}
        roteiroIa={null}
        enviarMensagem={() => {}}
      />
    );

    expect(screen.getByPlaceholderText("Digite sua resposta...")).toBeDefined();
  });

  it("renderiza outro placeholder quando já existe roteiro", () => {
    render(
      <ChatInput
        input=""
        setInput={() => {}}
        carregando={false}
        roteiroIa={{} as never}
        enviarMensagem={() => {}}
      />
    );

    expect(
      screen.getByPlaceholderText("Peça uma alteração no roteiro...")
    ).toBeDefined();
  });

  it("chama setInput quando o usuário digita", () => {
    const setInput = vi.fn();

    render(
      <ChatInput
        input=""
        setInput={setInput}
        carregando={false}
        roteiroIa={null}
        enviarMensagem={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Digite sua resposta..."), {
      target: { value: "Paris" },
    });

    expect(setInput).toHaveBeenCalledWith("Paris");
  });

  it("não permite enviar mensagem vazia", () => {
    render(
      <ChatInput
        input=""
        setInput={() => {}}
        carregando={false}
        roteiroIa={null}
        enviarMensagem={() => {}}
      />
    );

    const botaoEnviar = screen.getByRole("button", {
      name: "Enviar mensagem",
    }) as HTMLButtonElement;

    expect(botaoEnviar.disabled).toBe(true);
  });

  it("chama enviarMensagem quando envia o formulário", () => {
    const enviarMensagem = vi.fn();

    render(
      <ChatInput
        input="Quero ir para Paris"
        setInput={() => {}}
        carregando={false}
        roteiroIa={null}
        enviarMensagem={enviarMensagem}
      />
    );

    const botaoEnviar = screen.getByRole("button", {
      name: "Enviar mensagem",
    });

    fireEvent.click(botaoEnviar);

    expect(enviarMensagem).toHaveBeenCalledWith("Quero ir para Paris");
  });
});