import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiOrigin = process.env.API_ORIGIN || "http://localhost:8787";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": apiOrigin
    }
  }
});
