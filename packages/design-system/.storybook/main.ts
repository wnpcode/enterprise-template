import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  // logo.svg untuk brandImage di manager.ts
  staticDirs: [{ from: "../../../brand", to: "/brand" }],
  viteFinal: (config) => ({
    ...config,
    // plugin dts hanya untuk build library, bukan untuk Storybook
    plugins: [...(config.plugins ?? []).filter((p) => !(p && "name" in p && p.name === "unplugin-dts")), tailwindcss()],
  }),
};

export default config;
