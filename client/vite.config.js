import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/*
  proxy: the browser calls /api/issues on port 5173.
  Vite forwards that to Express on port 3000.
  The React code can use fetch("/api/issues") — no CORS extra step in the lab.
*/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
