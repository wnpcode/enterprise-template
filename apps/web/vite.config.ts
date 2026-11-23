/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // sumber tunggal nama produk: VITE_APP_NAME di .env (index.html memakai %VITE_APP_NAME%)
  const appName = loadEnv(mode, process.cwd(), "VITE_").VITE_APP_NAME;
  return {
    // port dikunci supaya tidak bergeser ke 5174 saat 5173 terpakai; origin berbeda = service worker MSW dan sesi berbeda
    server: { port: 5173, strictPort: true },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "apple-touch-icon.png"],
        manifest: {
          name: appName,
          short_name: appName,
          description: "Portal administrasi sekolah",
          lang: "id",
          display: "standalone",
          start_url: "/app",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
            { src: "pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: { navigateFallback: "/index.html" },
      }),
    ],
    // testTimeout dinaikkan: test yang merender halaman penuh melewati 5 detik saat semua worker jalan paralel
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      testTimeout: 15000,
    },
  };
});
