import { describe, expect, it } from "vitest";
import { TEXTOS } from "@/components/c_auth/textos";

describe("TEXTOS", () => {
  it("possui textos da tela de login", () => {
    expect(TEXTOS.login.titulo).toBe("Bem-vindo de volta!");
    expect(TEXTOS.login.botao).toBe("Entrar");
  });

  it("possui textos da tela de registro", () => {
    expect(TEXTOS.registro.titulo).toBe("Crie sua conta");
    expect(TEXTOS.registro.botao).toBe("Criar Conta");
  });

  it("possui textos da tela de recuperação de senha", () => {
    expect(TEXTOS.recuperar.titulo).toBe("Recuperar senha");
    expect(TEXTOS.recuperar.botao).toBe("Enviar link de recuperação");
  });
});