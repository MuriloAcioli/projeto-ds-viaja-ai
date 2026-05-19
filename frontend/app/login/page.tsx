"use client";

import { Suspense, useState } from "react";
import { AuthContent } from "@/components/c_auth/auth_content";
import type { Visao } from "@/components/c_auth/types";

export default function AuthPage() {
  const [visao, setVisao] = useState<Visao>("login");

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthContent visao={visao} setVisao={setVisao} />
    </Suspense>
  );
}
