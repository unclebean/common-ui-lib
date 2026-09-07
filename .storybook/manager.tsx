import * as React from "react";
import { addons, types } from "@storybook/manager-api";
import { AIMockupPanel } from "./addons/ai-mockup/AIMockupPanel";

const ADDON_ID = "common-ui/ai-mockup-studio";
const PANEL_ID = `${ADDON_ID}/panel`;

addons.setConfig({
  showPanel: true,
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

  // Ensure our panel is selected when Storybook boots up
  api.on("STORYBOOK_READY", () => {
    try {
      api.setSelectedPanel(PANEL_ID);
      api.setOptions({ showPanel: true });
    } catch {}
  });
});

