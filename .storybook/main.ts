import path from "path";
import type { StorybookConfig } from "@storybook/react-vite";
import { aiMockupVitePlugin } from "./ai-vite-plugin";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };
    viteConfig.plugins = viteConfig.plugins || [];
    viteConfig.plugins.push(aiMockupVitePlugin());
    return viteConfig;
  },
};

export default config;
