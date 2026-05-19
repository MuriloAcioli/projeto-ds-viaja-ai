import type { Visao } from "@/components/c_auth/types";

export const TEXTOS: Record<
  Visao,
  { titulo: string; subtitulo: string; botao: string }
> = {
  login: {
    titulo: "Bem-vindo de volta!",
    subtitulo: "Insira seus dados para continuar planejando.",
    botao: "Entrar",
  },
  registro: {
    titulo: "Crie sua conta",
    subtitulo: "Junte-se a nós agora mesmo.",
    botao: "Criar Conta",
  },
  recuperar: {
    titulo: "Recuperar senha",
    subtitulo: "Digite seu e-mail para receber um link de redefinição.",
    botao: "Enviar link de recuperação",
  },
};
