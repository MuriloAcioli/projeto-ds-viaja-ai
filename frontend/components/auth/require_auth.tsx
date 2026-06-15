"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

/**
 * Protege uma rota: redireciona para /login se não houver usuário autenticado.
 * Enquanto valida a sessão, exibe um estado de carregamento.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-[#0F2942]">
        Carregando…
      </div>
    );
  }

  return <>{children}</>;
}
