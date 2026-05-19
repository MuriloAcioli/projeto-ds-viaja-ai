import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeHeader() {
  return (
    <header className="w-full h-20 px-8 flex items-center justify-between z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shrink-0">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" width={120} height={70} alt="Logo da página do Viaja Aí, um avião deixando um jato de fumaça para trás nas cores vermelho e azul, ambas em tons escuros."/>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="font-medium text-secondary hover:text-white transition-colors">
          Entrar
        </Link>

        <Link href="/login?aba=registro">
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-6">
            Criar conta
          </Button>
        </Link>
      </div>
    </header>
  );
}
