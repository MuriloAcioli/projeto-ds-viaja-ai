import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroCard() {
  return (
    <div className="relative bg-secondary h-150 w-99 ml-45 px-7 pt-0 pb-7 rounded-2xl shadow-2xl flex flex-col gap-5">
      <Image className="mb-5" src="/logo.png" width={145} height={41} alt="Logo da página do Viaja Aí, um avião deixando um jato de fumaça para trás nas cores vermelho e azul, ambas em tons escuros."/>
      <div className="absolute left-42 top-8 flex flex-col items-center gap-0">
      <Image src="/bubble-relogios.png" width={145} height={49} alt="Colagem de torres de relógio de Zurique, Londres (Big Ben) e Kiev, com um relógio de rua no centro."/>
      <p className="font-bold text-base text-center text-primary -mt-2">Economize <br/> o seu tempo</p>
      <p className="font-medium text-xs text-muted-foreground text-center">Nós cuidamos da pesquisa, <br/> você curte o destino.</p>
      </div>
      <div className="absolute left-5 top-45 flex flex-col items-center gap-0">
      <Image src="/bubble-roteiro.png" width={145} height={49} alt="Imagem circular com fundo azul escuro destacando diversos elementos que representam viagens. Da esquerda para a direita: um pinheiro verde com uma bicicleta azul estacionada na frente, a Torre Eiffel ao fundo, um clássico ônibus vermelho de dois andares no centro, e a estátua colorida do Galo da Madrugada usando uma câmera fotográfica pendurada no pescoço."/>
      <p className="font-bold text-base text-center text-primary -mt-2">Roteiros <br/> personalizados</p>
      <p className="font-medium text-xs text-muted-foreground text-center">Para todos os gostos e <br/> para todos os lugares.</p>
      </div>
      <div className="absolute left-52 top-61 flex flex-col items-center gap-0">
      <Image src="/bubble-facilidade.png" width={145} height={49} alt="Imagem circular com fundo azul escuro destacando diversos elementos que representam viagens. Da esquerda para a direita: um pinheiro verde com uma bicicleta azul estacionada na frente, a Torre Eiffel ao fundo, um clássico ônibus vermelho de dois andares no centro, e a estátua colorida do Galo da Madrugada usando uma câmera fotográfica pendurada no pescoço."/>
      <p className="font-bold text-base text-center text-primary -mt-2">Facilidade</p>
      <p className="font-medium text-xs text-muted-foreground text-center">Esqueça as abas abertas. <br/> Tudo em um só lugar.</p>
      </div>
      <div className="mt-auto flex flex-col items-center gap-2">
        <Link href="/login?aba=registro"><Button size="lg" className="h-11 px-4 text-sm font-medium">Cadastre-se e planeje <ArrowRight /></Button></Link>
        <p className="text-[13px] text-muted-foreground">Já tem um cadastro? <Link href="/login" className="underline hover:text-primary">Faça login</Link></p>
      </div>
    </div>
  );
}
