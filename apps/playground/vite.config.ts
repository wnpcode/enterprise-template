import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// 5180 agar tidak berebut dengan apps/web di 5173
// base relatif agar bundel jalan di subpath GitHub Pages (/enterprise-template/playground/); routing memakai hash, jadi aman
export default defineConfig({ base: "./", server: { port: 5180, strictPort: true }, plugins: [react(), tailwindcss()] });
