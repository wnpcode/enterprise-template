/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.tsx", "src/**/*.stories.tsx", "src/test"],
    }),
  ],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" },
    // semua import bare (dependency dan peer) diambil dari node_modules consumer, bukan dibundel
    rollupOptions: {
      external: (id) => !/^[./]/.test(id),
      // agar komponennya bisa diimpor dari server component Next.js
      output: { banner: '"use client";' },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.test.tsx"],
  },
});
