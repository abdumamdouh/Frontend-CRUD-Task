import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve:
    mode === "test"
      ? {
          alias: {
            "@phosphor-icons/react": fileURLToPath(
              new URL("./src/test/phosphorIconsMock.tsx", import.meta.url),
            ),
          },
        }
      : undefined,
  test: {
    alias: {
      "@phosphor-icons/react": fileURLToPath(
        new URL("./src/test/phosphorIconsMock.tsx", import.meta.url),
      ),
    },
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.tsx",
    css: true,
  },
}));
