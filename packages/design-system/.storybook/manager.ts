import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({ base: "light", brandTitle: "enterprise-template", brandImage: "/brand/logo.svg", brandTarget: "_self" }),
});
