import type { Mensagem } from "@/lib/types/chat";

export function ChatMessage({ mensagem }: { mensagem: Mensagem }) {
  return (
    <div
      className={`max-w-[85%] ${mensagem.remetente === "user" ? "self-end" : "self-start"}`}
    >
      <div
        className={`p-4 rounded-2xl border text-[15px] leading-relaxed shadow-sm ${
          mensagem.remetente === "user"
            ? "bg-[#0F2942] text-white border-[#0F2942] rounded-tr-sm"
            : "bg-white border-[#EACFC4] text-[#0F2942] rounded-tl-sm"
        }`}
      >
        <span className="whitespace-pre-wrap">{mensagem.texto}</span>
      </div>
    </div>
  );
}
