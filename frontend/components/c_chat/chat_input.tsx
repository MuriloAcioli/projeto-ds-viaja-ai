import { Image as ImageIcon, MapPin, Send } from "lucide-react";
import type { RoteiroIa } from "@/lib/types/chat";

interface ChatInputProps {
  input: string;
  setInput: (valor: string) => void;
  carregando: boolean;
  roteiroIa: RoteiroIa | null;
  enviarMensagem: (texto: string) => void;
}

export function ChatInput({
  input,
  setInput,
  carregando,
  roteiroIa,
  enviarMensagem,
}: ChatInputProps) {
  return (
    <footer className="p-6 pt-2 bg-white flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviarMensagem(input);
        }}
        className="flex items-center gap-3 p-2 rounded-2xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#D68585]/30 transition-all"
      >
        <button
          type="button"
          disabled
          className="p-2 text-gray-300 cursor-not-allowed"
          aria-label="Anexar imagem (em breve)"
        >
          <ImageIcon size={22} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          disabled
          className="p-2 text-gray-300 cursor-not-allowed -ml-2"
          aria-label="Localização (em breve)"
        >
          <MapPin size={22} strokeWidth={1.5} />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={carregando || !!roteiroIa}
          placeholder={
            roteiroIa
              ? "Roteiro finalizado. Inicie um novo chat para planejar outra viagem."
              : "Digite sua resposta..."
          }
          className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder:text-gray-400 disabled:opacity-50 text-sm"
        />

        <button
          type="submit"
          disabled={carregando || !!roteiroIa || !input.trim()}
          className="w-12 h-12 bg-[#D68585] rounded-xl flex items-center justify-center text-white hover:bg-[#C57474] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          aria-label="Enviar mensagem"
        >
          <Send size={20} strokeWidth={1.5} className="-ml-1" />
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 font-medium">
        O ViajaAI pode cometer erros. Considere verificar as informações.
      </p>
    </footer>
  );
}
