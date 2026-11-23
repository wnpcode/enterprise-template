import type { Preview } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema",
      toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
    },
    skin: {
      description: "Skin",
      toolbar: {
        title: "Skin",
        icon: "paintbrush",
        items: ["flat", "neo", "glass", "clay", "fluid", "aurora", "swiss"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", skin: "flat" },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = String(context.globals.theme);
      const skin = String(context.globals.skin);
      if (skin === "flat") delete document.documentElement.dataset.skin;
      else document.documentElement.dataset.skin = skin;
      return <Story />;
    },
  ],
  parameters: {
    a11y: { test: "error" },
    backgrounds: { disable: true },
  },
};

export default preview;
