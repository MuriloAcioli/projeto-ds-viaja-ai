"use client";

import { ChatPanel } from "@/components/c_chat/chat_panel";
import { RoteiroDinamico } from "@/components/c_roteiro/roteiro_dinamico";
import { useChat } from "@/lib/hooks/use_chat";

export default function ChatPage() {
  const chat = useChat();

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <ChatPanel {...chat} />

      <div className="flex-1">
        <RoteiroDinamico
          dados={chat.dadosColetados}
          roteiroIa={chat.roteiroIa}
        />
      </div>
    </div>
  );
}
