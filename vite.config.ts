import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@higgsfield/quanta/button": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@higgsfield/quanta/card": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@higgsfield/quanta/icon": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@higgsfield/quanta/loader": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@higgsfield/quanta/tabs": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@higgsfield/quanta/textarea": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@higgsfield/quanta/typography": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@higgsfield/quanta/sonner": path.resolve(__dirname, "src/lib/quanta-shims.tsx"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: { "/api": "http://localhost:3001" },
  },
  build: { outDir: "dist/client" },
});
