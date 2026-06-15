"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Campo } from "@/components/c_auth/campo";
import { TEXTOS } from "@/components/c_auth/textos";
import type { Visao } from "@/components/c_auth/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";

export function AuthContent({
  visao,
  setVisao,
}: {
  visao: Visao;
  setVisao: (v: Visao) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, registro, user } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (searchParams.get("aba") === "registro") setVisao("registro");
  }, [searchParams, setVisao]);

  // If user is already logged in, redirect to chat
  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  const { titulo, subtitulo, botao } = TEXTOS[visao];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      if (visao === "login") {
        await login(email, senha);
        router.push("/chat");
      } else if (visao === "registro") {
        await registro(nome, email, senha);
        router.push("/chat");
      } else if (visao === "recuperar") {
        // Recuperação de senha não implementada ainda
        setErro("Funcionalidade de recuperação de senha em breve!");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      setErro(message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fundo-login.jpg"
          alt="Paisagem de fundo"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <Image src="/logo.png" width={170} height={40} alt="Logo Viaja Aí" />
          <h1 className="text-2xl font-bold text-primary">{titulo}</h1>
          <p className="text-sm text-muted-foreground">{subtitulo}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {visao === "registro" && (
            <Campo
              label="Nome completo"
              type="text"
              placeholder="Como quer ser chamado?"
              value={nome}
              onChange={setNome}
            />
          )}

          <Campo
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={setEmail}
          />

          {visao !== "recuperar" && (
            <Campo
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={setSenha}
            >
              {visao === "login" && (
                <button
                  type="button"
                  onClick={() => setVisao("recuperar")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
            </Campo>
          )}

          {erro && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={carregando}
            className="mt-2 h-12 w-full text-base rounded-xl disabled:opacity-60"
          >
            {carregando ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Aguarde...
              </span>
            ) : (
              botao
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {visao === "login" && (
            <p>
              Ainda não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setVisao("registro");
                  setErro("");
                }}
                className="font-semibold text-primary hover:underline"
              >
                Crie aqui
              </button>
            </p>
          )}
          {visao === "registro" && (
            <p>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setVisao("login");
                  setErro("");
                }}
                className="font-semibold text-primary hover:underline"
              >
                Faça login
              </button>
            </p>
          )}
          {visao === "recuperar" && (
            <button
              type="button"
              onClick={() => {
                setVisao("login");
                setErro("");
              }}
              className="font-semibold text-primary hover:underline flex items-center justify-center gap-2 w-full"
            >
              ← Voltar para o Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
