import * as React from "react";
import { addons, types } from "@storybook/manager-api";
import { AIMockupPanel } from "./addons/ai-mockup/AIMockupPanel";

const ADDON_ID = "common-ui/ai-mockup-studio";
const PANEL_ID = `${ADDON_ID}/panel`;

addons.setConfig({
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

  // Ensure sidebar is hidden and AI panel is selected when Storybook boots up
  api.on("STORYBOOK_READY", () => {
    try {
      if (typeof api.getIsNavShown === "function" && api.getIsNavShown()) {
        if (typeof api.toggleNav === "function") {
          api.toggleNav(false);
        }
      } else if (typeof api.toggleNav === "function") {
        // Double-check nav status
        const isShown = api.getState()?.layout?.navSize > 0;
        if (isShown) {
          api.toggleNav(false);
        }
      }
      api.setOptions({
        showNav: false,
        showPanel: true,
      });
      api.setSelectedPanel(PANEL_ID);
    } catch {}
  });
});


