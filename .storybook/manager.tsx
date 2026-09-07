import * as React from "react";
import { addons, types } from "@storybook/manager-api";
import { AIMockupPanel } from "./addons/ai-mockup/AIMockupPanel";

const ADDON_ID = "common-ui/ai-mockup-studio";
const PANEL_ID = `${ADDON_ID}/panel`;

addons.setConfig({
  navSize: 0,
  showNav: false, // Hide left sidebar by default
  showPanel: true, // Keep AI assistant panel open
  panelPosition: "right",
  selectedPanel: PANEL_ID,
  rightPanelWidth: 460,
});

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "🤖 AI Mockup Studio",
    match: ({ viewMode }) => viewMode === "story" || viewMode === "docs",
    render: ({ active }) => (
      <AIMockupPanel active={active} api={api} channel={addons.getChannel()} />
    ),
  });

  const collapseSidebar = () => {
    try {
      if (typeof api.getIsNavShown === "function" && api.getIsNavShown()) {
        if (typeof api.toggleNav === "function") {
          api.toggleNav(false);
        }
      } else if (typeof api.toggleNav === "function") {
        const isShown = api.getState()?.layout?.navSize > 0;
        if (isShown) {
          api.toggleNav(false);
        }
      }

      if (typeof api.setSizes === "function") {
        api.setSizes({ navSize: 0, rightPanelWidth: 460, bottomPanelHeight: 300 });
      }

      api.setOptions({
        showNav: false,
        showPanel: true,
      });
      api.setSelectedPanel(PANEL_ID);
    } catch {}
  };

  // 1. Initial attempt
  collapseSidebar();

  // 2. Delayed fallback attempts to ensure manager layout reflects navSize: 0
  setTimeout(collapseSidebar, 50);
  setTimeout(collapseSidebar, 200);
  setTimeout(collapseSidebar, 500);

  // 3. Listen to Storybook 8 core lifecycle events
  api.on("setStories", collapseSidebar);
  api.on("storySpecified", collapseSidebar);
  api.on("storyRendered", collapseSidebar);
  api.on("currentStoryWasSet", collapseSidebar);
});


