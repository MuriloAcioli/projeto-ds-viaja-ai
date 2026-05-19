"use client";

import type { RefObject } from "react";
import { ChatHeader } from "@/components/c_chat/chat_header";
import { ChatInput } from "@/components/c_chat/chat_input";
import { ChatLoading } from "@/components/c_chat/chat_loading";
import { ChatMessage } from "@/components/c_chat/chat_message";
import { ChatOptions } from "@/components/c_chat/chat_options";
import type {
  DadosColetados,
  Mensagem,
  OpcoesObjetos,
  RoteiroIa,
} from "@/lib/types/chat";

interface ChatPanelProps {
  mensagens: Mensagem[];
  opcoes: string[];
  input: string;
  setInput: (valor: string) => void;
  carregando: boolean;
  etapaAtual: string;
  roteiroIa: RoteiroIa | null;
  opcoesObjetos: OpcoesObjetos;
  dadosColetados: DadosColetados;
  bottomRef: RefObject<HTMLDivElement | null>;
  enviarMensagem: (texto: string) => void;
}

export function ChatPanel({
  mensagens,
  opcoes,
  input,
  setInput,
  carregando,
  etapaAtual,
  roteiroIa,
  opcoesObjetos,
  dadosColetados,
  bottomRef,
  enviarMensagem,
}: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-3xl shadow-sm border overflow-hidden">
      <ChatHeader roteiroIa={roteiroIa} />

      <div className="flex-1 p-6 bg-white overflow-y-auto flex flex-col gap-4 custom-scrollbar">
        {mensagens.map((msg, idx) => (
          <ChatMessage key={idx} mensagem={msg} />
        ))}

        {carregando && <ChatLoading />}

        <ChatOptions
          opcoes={opcoes}
          carregando={carregando}
          etapaAtual={etapaAtual}
          opcoesObjetos={opcoesObjetos}
          dadosColetados={dadosColetados}
          enviarMensagem={enviarMensagem}
        />

        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        carregando={carregando}
        roteiroIa={roteiroIa}
        enviarMensagem={enviarMensagem}
      />
    </div>
  );
}
