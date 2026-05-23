# ViajaAI 🌍✈️

Plataforma de roteiros de viagem personalizados gerados por IA, com busca real de voos, hotéis, atrações e previsão do tempo.

## Tecnologias

**Backend**

- [FastAPI](https://fastapi.tiangolo.com/) — framework web
- [SQLAlchemy](https://sqlalchemy.org/) + [PostgreSQL](https://www.postgresql.org/) — banco de dados
- [Alembic](https://alembic.sqlalchemy.org/) — migrations
- [Anthropic Claude Haiku](https://www.anthropic.com/) — geração de roteiros com IA
- [Gemini 3 Flash Preview](https://ai.google.dev/gemini) — geração de roteiros com IA
- [SerpAPI](https://serpapi.com/) — busca de voos e hotéis
- [TripAdvisor Content API](https://tripadvisor.com/developers) — atrações e pontos de interesse
- [OpenWeatherMap](https://openweathermap.org/api) — previsão do tempo

**Frontend**

- [Next.js](https://nextjs.org/) — framework React com App Router
- [React](https://react.dev/) — construção da interface
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) — estilização da interface
- [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/) — componentes de interface
- [Lucide React](https://lucide.dev/) e HugeIcons — ícones
- [Vitest](https://vitest.dev/) + React Testing Library — testes unitários do frontend

## Estrutura do projeto

```
projeto-ds-viaja-ai/
├── backend/
│   ├── alembic/                 # Migrations do banco de dados
│   ├── app/
│   │   ├── main.py              # Endpoints da API
│   │   ├── db/
│   │   │   ├── database.py      # Conexão com o banco
│   │   │   └── models.py        # Models do SQLAlchemy
│   │   ├── schemas/
│   │   │   └── chat.py          # Schemas Pydantic
│   │   ├── ia/
│   │   │   └── llm_client.py    # Integração com Claude Haiku / Gemini
│   │   └── services/
│   │       ├── chat_flow.py     # Lógica do fluxo de chat
│   │       ├── sessao.py        # Gerenciamento de sessões
│   │       ├── SerpAPI.py       # Voos e hotéis
│   │       ├── TripAdvisor.py   # Atrações
│   │       └── OpenWeather.py   # Previsão do tempo
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    ├── app/                     # Rotas do Next.js App Router
    │   ├── page.tsx             # Página inicial
    │   ├── layout.tsx           # Layout raiz
    │   ├── globals.css          # Estilos globais e tema
    │   ├── chat/                # Tela principal do chat
    │   ├── login/               # Login, cadastro e recuperação de senha
    │   ├── explorar/            # Tela de exploração de destinos
    │   └── historico/           # Tela de histórico de roteiros
    ├── components/              # Componentes reutilizáveis da interface
    │   ├── c_auth/              # Componentes de autenticação
    │   ├── c_chat/              # Componentes do chat
    │   ├── c_explorar/          # Componentes da tela explorar
    │   ├── c_historico/         # Componentes do histórico
    │   ├── c_home/              # Componentes da página inicial
    │   ├── c_roteiro/           # Cards e visualização do roteiro
    │   └── ui/                  # Componentes base de UI
    ├── lib/
    │   ├── api/                 # Funções de comunicação com a API
    │   ├── data/                # Dados mockados usados no frontend
    │   ├── helpers/             # Funções auxiliares de transformação de dados
    │   ├── hooks/               # Hooks customizados, como useChat
    │   ├── types/               # Tipos TypeScript compartilhados
    │   └── utils.ts             # Utilitários gerais
    ├── __tests__/               # Testes unitários do frontend
    ├── public/                  # Imagens, vídeos e arquivos estáticos
    ├── vitest.config.mts        # Configuração dos testes
    ├── next.config.ts           # Configuração do Next.js
    ├── package.json
    └── tsconfig.json
```

## Como rodar o backend

### 1. Pré-requisitos

- Python 3.11+
- PostgreSQL instalado e rodando

### 2. Clonar e entrar na pasta

```bash
cd backend
```

### 3. Criar e ativar o ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### 4. Instalar dependências

```bash
pip install -r requirements.txt
```

### 5. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais (veja a seção de variáveis abaixo).

### 6. Criar o banco de dados

```bash
psql postgres -c "CREATE DATABASE travel_db;"
```

### 7. Rodar as migrations

```bash
alembic upgrade head
```

### 8. Rodar o servidor

```bash
uvicorn app.main:app --reload
```

O servidor estará disponível em `http://localhost:8000`.
A documentação interativa estará em `http://localhost:8000/docs`.

## Como rodar o frontend (deve ser aberto outro terminal, e manter ambos abertos).

### 1. Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:8000`

### 2. Entrar na pasta

```bash
cd frontend
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

### Scripts úteis do frontend

| Comando            | Descrição                                      |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Inicia o servidor de desenvolvimento           |
| `npm run build`    | Gera a versão de produção do frontend          |
| `npm run start`    | Executa a versão de produção já gerada         |
| `npm run lint`     | Executa a análise estática com ESLint          |
| `npm run test`     | Executa os testes em modo interativo/watch     |
| `npm run test:run` | Executa todos os testes uma vez                |
| `npm run coverage` | Executa os testes e gera relatório de cobertura |

## Funcionamento do frontend

O frontend é responsável por exibir a interface do usuário, controlar a navegação entre telas e se comunicar com a API do backend.

### Principais telas

| Rota         | Descrição |
| ------------ | --------- |
| `/`          | Página inicial com apresentação da plataforma e chamadas para login/cadastro |
| `/login`     | Tela de autenticação, cadastro e recuperação de senha |
| `/chat`      | Tela principal de planejamento de viagem por conversa |
| `/explorar`  | Tela com destinos e atrações filtradas por cidade e categoria |
| `/historico` | Tela de histórico dos roteiros já planejados |

### Fluxo do chat no frontend

A tela `/chat` usa o hook `useChat`, localizado em `frontend/lib/hooks/use_chat.ts`, para controlar o estado da conversa. Esse hook armazena mensagens, opções de resposta, dados coletados, estado de carregamento, roteiro gerado e informações selecionadas pelo usuário.

O fluxo geral é:

1. Ao abrir a tela de chat, o frontend chama a API para iniciar uma nova sessão.
2. A resposta do backend define a primeira mensagem do bot e a etapa atual.
3. Quando o usuário envia uma resposta, o frontend envia a mensagem para o backend.
4. O backend retorna a próxima etapa, novas opções e, quando necessário, dados extras como voos e hotéis.
5. Ao final do fluxo, o roteiro gerado é exibido no painel de roteiro dinâmico.
6. Depois que um roteiro é gerado, o usuário pode solicitar modificações no roteiro.

### Comunicação com a API

As chamadas para o backend ficam concentradas em `frontend/lib/api/chat.ts`.

Por padrão, o frontend usa:

```text
http://localhost:8000
```

Também é possível configurar a URL da API com a variável:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

As principais funções usadas pelo frontend são:

| Função | Endpoint utilizado | Descrição |
| ------ | ------------------ | --------- |
| `iniciarChat` | `POST /api/chat/iniciar` | Inicia uma nova sessão de chat |
| `enviarMensagemChat` | `POST /api/chat/mensagem` | Envia a resposta do usuário para o backend |
| `modificarRoteiro` | `POST /api/viagens/{id}/modificar` | Solicita alterações em um roteiro já gerado |

### Componentização

Os componentes foram separados por área da interface:

- `components/c_home`: página inicial;
- `components/c_auth`: autenticação;
- `components/c_chat`: mensagens, opções, input e cabeçalho do chat;
- `components/c_roteiro`: visualização do roteiro, cards de voo e hotel;
- `components/c_explorar`: tela de exploração de destinos;
- `components/c_historico`: histórico de roteiros;
- `components/ui`: componentes base reutilizáveis.

A pasta `lib` concentra funções auxiliares, tipos, dados mockados, hooks e comunicação com a API. Isso evita deixar regras de negócio misturadas diretamente nos componentes visuais.

## Testes automatizados do frontend

O frontend possui testes unitários configurados com Vitest e React Testing Library.

A estratégia adotada foi começar por testes simples e fáceis de manter, focando em partes pequenas e previsíveis do código, como funções utilitárias, helpers, componentes reutilizáveis e dados mockados.

Os testes estão localizados em:

```text
frontend/__tests__/
```

Arquivos de teste atuais:

```text
__tests__/
├── chat_cards.test.ts
├── chat_header.test.tsx
├── chat_input.test.tsx
├── chat_message.test.tsx
├── fields.test.tsx
├── mock_atracoes.test.ts
├── status.test.ts
├── textos.test.ts
└── utils.test.ts
```

Os testes cobrem, inicialmente:

- formatação de duração em `formatarDuracao`;
- estilos de status no histórico com `getStatusStyle`;
- textos da tela de autenticação;
- componente reutilizável `Campo`;
- componentes do chat, como `ChatHeader`, `ChatMessage` e `ChatInput`;
- helpers de montagem dos cards de voo e hotel;
- dados mockados da tela de exploração.

### Como executar os testes

```bash
cd frontend
npm run test:run
```

Resultado atual:

```text
Test Files  9 passed (9)
Tests       27 passed (27)
```

### Como gerar relatório de cobertura

```bash
cd frontend
npm run coverage
```

Cobertura atual dos módulos testados:

| Métrica    | Cobertura |
| ---------- | --------- |
| Statements | 86.66%    |
| Branches   | 57.5%     |
| Functions  | 94.11%    |
| Lines      | 88.09%    |

Observação: essa cobertura considera os arquivos incluídos na configuração do `vitest.config.mts`, ou seja, representa a cobertura inicial dos módulos testados, não necessariamente de todo o frontend.

## Variáveis de ambiente

| Variável                 | Onde obter                                                       | Obrigatória |
| ------------------------ | ---------------------------------------------------------------- | ----------- |
| `ANTHROPIC_API_KEY`      | [console.anthropic.com](https://console.anthropic.com)           | Sim         |
| `GEMINI_API_KEY`         | [ai.google.dev](https://ai.google.dev)                           | Sim         |
| `SERPAPI_API_KEY`        | [serpapi.com](https://serpapi.com)                               | Sim         |
| `TRIPADVISOR_API_KEY`    | [tripadvisor.com/developers](https://tripadvisor.com/developers) | Não\* |
| `OPENWEATHERMAP_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api)         | Não\* |
| `DATABASE_URL`           | —                                                                | Sim         |
| `DATABASE_URL_SYNC`      | —                                                                | Sim         |
| `NEXT_PUBLIC_API_URL`    | URL local ou publicada do backend                                | Não |

\*Se não configurada, o serviço usa dados mock automaticamente.

## Endpoints principais

### Chat (fluxo principal)

| Método   | Endpoint                | Descrição                              |
| -------- | ----------------------- | -------------------------------------- |
| `POST`   | `/api/chat/iniciar`     | Inicia uma nova sessão de planejamento |
| `POST`   | `/api/chat/mensagem`    | Envia mensagem e avança o fluxo        |
| `DELETE` | `/api/chat/{sessao_id}` | Encerra a sessão                       |

### Viagens

| Método   | Endpoint                    | Descrição                                      |
| -------- | --------------------------- | ---------------------------------------------- |
| `GET`    | `/api/viagens`              | Lista todas as viagens salvas                  |
| `GET`    | `/api/viagens/{id}`         | Retorna roteiro completo de uma viagem         |
| `POST`   | `/api/viagens/{id}/modificar` | Solicita alterações em um roteiro já gerado  |
| `DELETE` | `/api/viagens/{id}`         | Remove uma viagem do histórico                 |

## Fluxo do chat

```
iniciar → destino → pessoas → orçamento → datas
→ passagens → hotéis → estilo → interesses → roteiro gerado
```

Cada etapa retorna um JSON com:

- `etapa_atual` — etapa em que o chat está
- `mensagem_bot` — texto a exibir na interface
- `opcoes` — botões de ação (quando aplicável)
- `dados_extra` — voos/hotéis para exibição detalhada
- `roteiro` — roteiro completo (somente na etapa final)
