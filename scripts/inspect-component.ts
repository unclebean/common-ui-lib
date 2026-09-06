/**
 * Figma Component Node Inspector
 *
 * Usage:
 *   npx tsx scripts/inspect-component.ts <componentNameOrNodeId>
 * Example:
 *   npx tsx scripts/inspect-component.ts button
 *   npx tsx scripts/inspect-component.ts 1:85
 */

import * as fs from "fs";
import * as path from "path";
import { figmaRgbaToHsl } from "./sync-figma-tokens";

async function inspectComponent() {
  if (typeof (process as any).loadEnvFile === "function") {
    if (fs.existsSync(".env.local")) (process as any).loadEnvFile(".env.local");
    else if (fs.existsSync(".env")) (process as any).loadEnvFile(".env");
  }

  const target = process.argv[2] || "button";
  const configPath = path.resolve(process.cwd(), ".figma/config.json");
  const mirrorPath = path.resolve(process.cwd(), ".figma/tokens.raw.json");

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN || config.personalAccessToken;
  const fileKey = process.env.FIGMA_FILE_KEY || config.figmaFileKey;

  if (!token) {
    console.error("Missing Figma Access Token. Please set FIGMA_PERSONAL_ACCESS_TOKEN in your .env file.");
    process.exit(1);
  }

  const headers = { "X-Figma-Token": token };

  let nodeId = target;

  // If input is a component name like "button", find its ID in the mirror
  if (!target.includes(":")) {
    if (fs.existsSync(mirrorPath)) {
      const mirror = JSON.parse(fs.readFileSync(mirrorPath, "utf8"));
      const found = mirror.components[target.toLowerCase()];
      if (found) {
        nodeId = found.id;
        console.log(`Resolved component "${target}" -> Node ID: ${nodeId}`);
      }
    }
  }

  console.log(`Inspecting Figma Node [${nodeId}] in file ${config.figmaFileKey}...`);
  const res = await fetch(
    `https://api.figma.com/v1/files/${config.figmaFileKey}/nodes?ids=${nodeId}`,
    { headers }
  );

  if (!res.ok) {
    console.error(`Figma API error ${res.status}: ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json();
  const node = data.nodes[nodeId]?.document;

  if (!node) {
    console.error(`Node ${nodeId} not found in file.`);
    process.exit(1);
  }

  console.log(`\n============== COMPONENT INSPECTION ==============`);
  console.log(`Name: ${node.name} (${node.type})`);
  console.log(`Total Variants / Children: ${node.children?.length || 1}`);

  const sample = node.children ? node.children[0] : node;
  console.log(`\nSample Variant: "${sample.name}"`);
  console.log(`Layout Mode: ${sample.layoutMode || "None"}`);
  console.log(`Padding:`, {
    top: sample.paddingTop ?? 0,
    bottom: sample.paddingBottom ?? 0,
    left: sample.paddingLeft ?? 0,
    right: sample.paddingRight ?? 0,
  });
  console.log(`Corner Radius: ${sample.cornerRadius ?? 0}px`);

  if (sample.fills && sample.fills.length > 0 && sample.fills[0].color) {
    const c = sample.fills[0].color;
    console.log(`Fill Color (RGB):`, c);
    console.log(`Fill Color (HSL): hsl(${figmaRgbaToHsl(c.r, c.g, c.b)})`);
  }

  console.log(`==================================================\n`);
}

inspectComponent().catch(console.error);
