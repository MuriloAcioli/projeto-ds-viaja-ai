import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    coverage: {
  provider: "v8",
  reporter: ["text", "html"],
  include: [
    "lib/utils.ts",
    "lib/helpers/chat_cards.ts",
    "lib/data/mockAtracoes.ts",
    "components/c_historico/status.ts",
    "components/c_auth/campo.tsx",
    "components/c_auth/textos.ts",
    "components/c_chat/chat_header.tsx",
    "components/c_chat/chat_message.tsx",
    "components/c_chat/chat_input.tsx",
        ],
    },
  },
});