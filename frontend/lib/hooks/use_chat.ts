"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { enviarMensagemChat, iniciarChat } from "@/lib/api/chat";
import type {
  DadosColetados,
  Mensagem,
  OpcoesObjetos,
  RoteiroIa,
} from "@/lib/types/chat";

const DADOS_INICIAIS: DadosColetados = {
  destino: "",
  origem: "",
  pessoas: "",
  orcamento: "",
  datas: "",
  estilo: "",
  voo_ida_escolhido: null,
  voo_volta_escolhido: null,
  hotel_escolhido: null,
};

export function useChat() {
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [opcoes, setOpcoes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState<string>("destino");
  const [roteiroIa, setRoteiroIa] = useState<RoteiroIa | null>(null);
  const [opcoesObjetos, setOpcoesObjetos] = useState<OpcoesObjetos>({});
  const [dadosColetados, setDadosColetados] =
    useState<DadosColetados>(DADOS_INICIAIS);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando, opcoes]);

  useEffect(() => {
    async function iniciar() {
      setCarregando(true);
      try {
        const data = await iniciarChat();
        setSessaoId(data.sessao_id);
        setEtapaAtual(data.etapa_atual);
        setMensagens([{ remetente: "bot", texto: data.mensagem_bot }]);
        if (data.opcoes?.length) setOpcoes(data.opcoes);
      } catch (err) {
        console.error("Erro ao iniciar chat:", err);
        setMensagens([
          {
            remetente: "bot",
            texto:
              "Ops! Não consegui conectar ao servidor. Tente recarregar a página.",
          },
        ]);
      } finally {
        setCarregando(false);
      }
    }

    iniciar();
  }, []);

  const atualizarDadosColetados = useCallback(
    (
      texto: string,
      etapa: string,
      opcoesList: string[],
      objetosOpcoes: OpcoesObjetos,
    ) => {
      setDadosColetados((prev) => {
        const novo = { ...prev };
        if (etapa === "destino") novo.destino = texto;
        if (etapa === "origem") novo.origem = texto;
        if (etapa === "pessoas") novo.pessoas = texto;
        if (etapa === "orcamento") novo.orcamento = texto;
        if (etapa === "datas") {
          novo.datas = novo.datas ? `${novo.datas} até ${texto}` : texto;
        }
        if (etapa === "estilo") {
          novo.estilo = texto.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, "").trim();
        }
        if (etapa === "voo_ida") {
          const idx = opcoesList.indexOf(texto);
          if (idx >= 0 && objetosOpcoes.voos) {
            novo.voo_ida_escolhido = objetosOpcoes.voos[idx] ?? null;
          }
        }
        if (etapa === "voo_volta") {
          const idx = opcoesList.indexOf(texto);
          if (idx >= 0 && objetosOpcoes.voos) {
            novo.voo_volta_escolhido = objetosOpcoes.voos[idx] ?? null;
          }
        }
        if (etapa === "hoteis") {
          const idx = opcoesList.indexOf(texto);
          if (idx >= 0 && objetosOpcoes.hoteis) {
            novo.hotel_escolhido = objetosOpcoes.hoteis[idx] ?? null;
          }
        }
        return novo;
      });
    },
    [],
  );

  const enviarMensagem = useCallback(
    async (texto: string) => {
      if (!texto.trim() || !sessaoId || carregando || roteiroIa) return;

      atualizarDadosColetados(texto, etapaAtual, opcoes, opcoesObjetos);

      setMensagens((prev) => [...prev, { remetente: "user", texto }]);
      setInput("");
      setOpcoes([]);
      setCarregando(true);

      try {
        const data = await enviarMensagemChat(sessaoId, texto);

        setEtapaAtual(data.etapa_atual);
        setMensagens((prev) => [
          ...prev,
          { remetente: "bot", texto: data.mensagem_bot },
        ]);

        if (data.opcoes?.length) setOpcoes(data.opcoes);
        if (data.dados_extra) setOpcoesObjetos(data.dados_extra);
        if (data.roteiro) setRoteiroIa(data.roteiro);
      } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
        setMensagens((prev) => [
          ...prev,
          {
            remetente: "bot",
            texto:
              "Ocorreu um erro ao processar sua mensagem. Tente novamente.",
          },
        ]);
      } finally {
        setCarregando(false);
      }
    },
    [
      sessaoId,
      carregando,
      roteiroIa,
      etapaAtual,
      opcoes,
      opcoesObjetos,
      atualizarDadosColetados,
    ],
  );

  return {
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
  };
}
