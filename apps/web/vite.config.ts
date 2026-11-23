/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// robots.txt dan sitemap.xml dibuat dari VITE_SITE_URL agar domain tidak tertulis di dua berkas statis
function siteFiles(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/$/, "");
  const sitemap = ["/", "/login", "/register"].map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n");
  return {
    name: "site-files",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\nDisallow: /app\n\nSitemap: ${base}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // sumber tunggal identitas produk: VITE_APP_NAME, VITE_APP_DESCRIPTION, VITE_SITE_URL di .env (index.html memakai %VITE_APP_NAME%)
  const env = loadEnv(mode, process.cwd(), "VITE_");
  for (const key of ["VITE_APP_NAME", "VITE_APP_DESCRIPTION", "VITE_SITE_URL"]) {
    if (!env[key]) throw new Error(`${key} wajib diisi di apps/web/.env`);
  }
  const appName = env.VITE_APP_NAME;
  return {
    // port dikunci supaya tidak bergeser ke 5174 saat 5173 terpakai; origin berbeda = service worker MSW dan sesi berbeda
    server: { port: 5173, strictPort: true },
    plugins: [
      react(),
      tailwindcss(),
      siteFiles(env.VITE_SITE_URL),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "apple-touch-icon.png"],
        manifest: {
          name: appName,
          short_name: appName,
          description: env.VITE_APP_DESCRIPTION,
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
        workbox: { navigateFallback: "/index.html", navigateFallbackDenylist: [/^\/api\//] },
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
