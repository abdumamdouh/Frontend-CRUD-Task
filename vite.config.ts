import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: "./",
  define:
    mode === "test"
      ? undefined
      : {
          "process.env.NODE_ENV": JSON.stringify("production"),
        },
  server: {
    port: 3000,
    strictPort: true,
    cors: {
      origin: "http://localhost:8080",
    },
  },
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
  build: {
    outDir: "build/static",
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    lib: {
      entry: fileURLToPath(new URL("./src/main.tsx", import.meta.url)),
      name: "UAEServicesDirectory",
      formats: ["iife"],
      fileName: () => "index.js",
      cssFileName: "style",
    },
    rollupOptions: {
      output: {
        assetFileNames: "[name][extname]",
        chunkFileNames: "[name].js",
        entryFileNames: "index.js",
      },
    },
  },
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
