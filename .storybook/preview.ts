import type { Preview } from "@storybook/react";
import "../src/tokens/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#020817" },
      ],
    },
    options: {
      storySort: {
        order: [
          "01. AI Mockups",
          ["Live AI Canvas", "Trading Terminal", "*"],
          "02. Brand Identity",
          "03. Core Primitives",
          "04. Forms & Controls",
          "05. Overlays & Navigation",
          "06. Layout & Shells",
          "07. Finance Modules",
          "08. Design Tokens",
          "*",
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === "#020817";
      if (typeof document !== "undefined") {
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return Story();
    },
  ],
};

export default preview;
