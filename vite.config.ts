import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { loadDevLiferayCredentials } from "./scripts/loadDevEnv";

const liferayShimPath = fileURLToPath(new URL("./src/dev/liferayShim.ts", import.meta.url));
const liferayShimStubPath = fileURLToPath(
  new URL("./src/dev/liferayShim.stub.ts", import.meta.url),
);

const { user: liferayUser, password: liferayPassword } = loadDevLiferayCredentials();
const liferayAuthHeader =
  liferayUser && liferayPassword
    ? `Basic ${Buffer.from(`${liferayUser}:${liferayPassword}`).toString("base64")}`
    : "";

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
    proxy: {
      "/o": {
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            if (liferayAuthHeader && !proxyReq.getHeader("authorization")) {
              proxyReq.setHeader("Authorization", liferayAuthHeader);
            }
          });
        },
        target: "http://localhost:8080",
      },
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
      : mode === "production"
        ? {
            [liferayShimPath]: liferayShimStubPath,
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
