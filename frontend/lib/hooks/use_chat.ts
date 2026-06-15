"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  enviarMensagemChat,
  iniciarChat,
  modificarRoteiro,
} from "@/lib/api/chat";
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

const MENSAGEM_PODE_MODIFICAR =
  "Seu roteiro está pronto. Deseja realizar alguma mudança? Você pode pedir, por exemplo: trocar o hotel, ajustar o orçamento ou mudar atividades de algum dia.";

const STORAGE_KEY = "viaja_ai_chat";

type EstadoPersistido = {
  sessaoId: string | null;
  itineraryId: number | null;
  mensagens: Mensagem[];
  opcoes: string[];
  etapaAtual: string;
  roteiroIa: RoteiroIa | null;
  opcoesObjetos: OpcoesObjetos;
  dadosColetados: DadosColetados;
};

export function useChat() {
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [itineraryId, setItineraryId] = useState<number | null>(null);
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
  const hidratadoRef = useRef(false);
  // Destino vindo do Explorar (/chat?destino=...) a ser enviado como 1ª resposta.
  const destinoPendenteRef = useRef<string | null>(null);

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
        hidratadoRef.current = true;
      }
    }

    // 1) Veio do Explorar com um destino → começa uma viagem nova já com ele.
    const destino =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("destino")
        : null;
    if (destino) {
      destinoPendenteRef.current = destino;
      window.localStorage.removeItem(STORAGE_KEY);
      // Remove o parâmetro da URL para não repetir ao recarregar.
      window.history.replaceState(null, "", window.location.pathname);
      iniciar();
      return;
    }

    // 2) Tenta restaurar uma conversa salva (não reseta ao trocar de aba/recarregar).
    const salvo =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (salvo) {
      try {
        const estado = JSON.parse(salvo) as EstadoPersistido;
        if (estado.sessaoId) {
          // setState client-only de hidratação: inicialização preguiçosa do
          // useState causaria hydration mismatch no SSR, então é intencional.
          /* eslint-disable react-hooks/set-state-in-effect */
          setSessaoId(estado.sessaoId);
          setItineraryId(estado.itineraryId);
          setMensagens(estado.mensagens ?? []);
          setOpcoes(estado.opcoes ?? []);
          setEtapaAtual(estado.etapaAtual ?? "destino");
          setRoteiroIa(estado.roteiroIa ?? null);
          setOpcoesObjetos(estado.opcoesObjetos ?? {});
          setDadosColetados(estado.dadosColetados ?? DADOS_INICIAIS);
          /* eslint-enable react-hooks/set-state-in-effect */
          hidratadoRef.current = true;
          return;
        }
      } catch (err) {
        console.error("Erro ao restaurar conversa salva:", err);
      }
    }

    // 3) Conversa nova padrão.
    iniciar();
  }, []);

  useEffect(() => {
    // Persiste o estado da conversa a cada mudança (só após hidratar/iniciar).
    if (!hidratadoRef.current || typeof window === "undefined") return;
    const estado: EstadoPersistido = {
      sessaoId,
      itineraryId,
      mensagens,
      opcoes,
      etapaAtual,
      roteiroIa,
      opcoesObjetos,
      dadosColetados,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  }, [
    sessaoId,
    itineraryId,
    mensagens,
    opcoes,
    etapaAtual,
    roteiroIa,
    opcoesObjetos,
    dadosColetados,
  ]);

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

  const reiniciarChat = useCallback(async (avisoInicial?: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setItineraryId(null);
    setRoteiroIa(null);
    setOpcoes([]);
    setOpcoesObjetos({});
    setDadosColetados(DADOS_INICIAIS);
    setEtapaAtual("destino");
    setCarregando(true);
    try {
      const data = await iniciarChat();
      setSessaoId(data.sessao_id);
      setEtapaAtual(data.etapa_atual);
      setMensagens(
        avisoInicial
          ? [
              { remetente: "bot", texto: avisoInicial },
              { remetente: "bot", texto: data.mensagem_bot },
            ]
          : [{ remetente: "bot", texto: data.mensagem_bot }],
      );
      setOpcoes(data.opcoes?.length ? data.opcoes : []);
    } catch (err) {
      console.error("Erro ao reiniciar chat:", err);
      setMensagens([
        {
          remetente: "bot",
          texto:
            "Ops! Não consegui iniciar uma nova viagem. Tente recarregar a página.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }, []);

  const enviarMensagem = useCallback(
    async (texto: string) => {
      const mensagemUsuario = texto.trim();
      if (!mensagemUsuario || carregando) return;

      if (mensagemUsuario.toLowerCase() === "nova viagem") {
        await reiniciarChat();
        return;
      }

      if (roteiroIa) {
        setMensagens((prev) => [
          ...prev,
          { remetente: "user", texto: mensagemUsuario },
        ]);
        setInput("");
        setOpcoes([]);

        if (!itineraryId) {
          setMensagens((prev) => [
            ...prev,
            {
              remetente: "bot",
              texto:
                "Não consegui identificar qual roteiro deve ser modificado. Gere um novo roteiro e tente novamente.",
            },
          ]);
          return;
        }

        setCarregando(true);

        try {
          const data = await modificarRoteiro(itineraryId, mensagemUsuario);

          setRoteiroIa(data.roteiro);
          setMensagens((prev) => [
            ...prev,
            { remetente: "bot", texto: data.mensagem },
          ]);
        } catch (err) {
          console.error("Erro ao modificar roteiro:", err);
          setMensagens((prev) => [
            ...prev,
            {
              remetente: "bot",
              texto:
                "Ocorreu um erro ao modificar seu roteiro. Tente novamente.",
            },
          ]);
        } finally {
          setCarregando(false);
        }

        return;
      }

      if (!sessaoId) return;

      atualizarDadosColetados(mensagemUsuario, etapaAtual, opcoes, opcoesObjetos);

      setMensagens((prev) => [
        ...prev,
        { remetente: "user", texto: mensagemUsuario },
      ]);
      setInput("");
      setOpcoes([]);
      setCarregando(true);

      try {
        const data = await enviarMensagemChat(sessaoId, mensagemUsuario);

        setEtapaAtual(data.etapa_atual);
        setMensagens((prev) => {
          const novasMensagens: Mensagem[] = [
            ...prev,
            { remetente: "bot", texto: data.mensagem_bot },
          ];

          if (data.roteiro) {
            novasMensagens.push({
              remetente: "bot",
              texto: MENSAGEM_PODE_MODIFICAR,
            });
          }

          return novasMensagens;
        });

        if (data.opcoes?.length) setOpcoes(data.opcoes);
        if (data.dados_extra) setOpcoesObjetos(data.dados_extra);
        if (data.itinerary_id) setItineraryId(data.itinerary_id);
        if (data.roteiro) setRoteiroIa(data.roteiro);
      } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
        // Sessão expirada no Redis (TTL): reinicia a conversa automaticamente.
        if ((err as { status?: number })?.status === 404) {
          await reiniciarChat(
            "Sua sessão expirou por inatividade. Vamos começar uma nova viagem! 🧳",
          );
          return;
        }
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
      itineraryId,
      carregando,
      roteiroIa,
      etapaAtual,
      opcoes,
      opcoesObjetos,
      atualizarDadosColetados,
      reiniciarChat,
    ],
  );

  useEffect(() => {
    // Conversa nova vinda do Explorar: envia o destino automaticamente.
    if (destinoPendenteRef.current && sessaoId && !carregando) {
      const destino = destinoPendenteRef.current;
      destinoPendenteRef.current = null;
      enviarMensagem(destino);
    }
  }, [sessaoId, carregando, enviarMensagem]);

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
    reiniciarChat,
  };
}
