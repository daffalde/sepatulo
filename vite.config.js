import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/app": {
        target: "https://app.sandbox.midtrans.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app/, ""),
      },
      "/api": {
        target: "https://api.sandbox.midtrans.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
