import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// 5180 agar tidak berebut dengan apps/web di 5173
export default defineConfig({ server: { port: 5180, strictPort: true }, plugins: [react(), tailwindcss()] });
