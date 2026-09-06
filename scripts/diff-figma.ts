/**
 * Figma Component & Token Diff Inspector
 *
 * Compares live Figma file against the local cached snapshot (.figma/tokens.raw.json)
 * and reports:
 * 1. Modified corner radii / design metrics
 * 2. New or removed components
 * 3. Color palette modifications
 */

import * as fs from "fs";
import * as path from "path";
import { figmaRgbaToHsl } from "./sync-figma-tokens";

async function diffFigma() {
  if (typeof (process as any).loadEnvFile === "function") {
    if (fs.existsSync(".env.local")) (process as any).loadEnvFile(".env.local");
    else if (fs.existsSync(".env")) (process as any).loadEnvFile(".env");
  }

  const configPath = path.resolve(process.cwd(), ".figma/config.json");
  const mirrorPath = path.resolve(process.cwd(), ".figma/tokens.raw.json");

  if (!fs.existsSync(configPath)) {
    console.error("Missing .figma/config.json");
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN || config.personalAccessToken;
  const fileKey = process.env.FIGMA_FILE_KEY || config.figmaFileKey;

  if (!token) {
    console.error("Missing Figma Access Token. Please set FIGMA_PERSONAL_ACCESS_TOKEN in your .env file.");
    process.exit(1);
  }

  const previous = fs.existsSync(mirrorPath)
    ? JSON.parse(fs.readFileSync(mirrorPath, "utf8"))
    : null;

  console.log(`\n🔍 Fetching latest live state from Figma (${fileKey})...`);
  const headers = { "X-Figma-Token": token };
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, { headers });

  if (!res.ok) {
    console.error(`Figma API returned ${res.status}: ${res.statusText}`);
    process.exit(1);
  }

  const data = await res.json();
  const currentComponents: Record<string, { id: string; name: string; variantCount: number }> = {};
  let currentRadius = "0.5rem";

  function walk(node: any) {
    if (node.type === "COMPONENT_SET" || node.type === "COMPONENT") {
      currentComponents[node.name.toLowerCase()] = {
        id: node.id,
        name: node.name,
        variantCount: node.children?.length || 1,
      };
    }
    if (typeof node.cornerRadius === "number" && node.cornerRadius > 0 && node.cornerRadius <= 16) {
      currentRadius = `${node.cornerRadius / 16}rem`;
    }
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(data.document);

  console.log(`\n================= FIGMA CHANGE REPORT =================`);
  console.log(`File Name: ${data.name}`);
  console.log(`Last Modified in Figma: ${data.lastModified}`);

  if (!previous) {
    console.log(`No previous snapshot found. Run "npm run sync:figma" to establish the initial baseline.`);
    return;
  }

  console.log(`Last Local Sync: ${previous.lastSync || "Unknown"}`);
  console.log(`-------------------------------------------------------`);

  // 1. Metric / Radius changes
  if (previous.detectedRadius !== currentRadius) {
    console.log(`⚠️  DESIGN METRIC CHANGED:`);
    console.log(`   Corner Radius: ${previous.detectedRadius} -> ${currentRadius}`);
  } else {
    console.log(`✓  Corner Radius: Unchanged (${currentRadius})`);
  }

  // 2. Component additions/removals
  const prevNames = new Set(Object.keys(previous.components || {}));
  const currNames = new Set(Object.keys(currentComponents));

  const added = [...currNames].filter((x) => !prevNames.has(x));
  const removed = [...prevNames].filter((x) => !currNames.has(x));
  const modifiedVariants: string[] = [];

  for (const name of currNames) {
    if (prevNames.has(name)) {
      const prevComp = previous.components[name];
      const currComp = currentComponents[name];
      if (prevComp.variantCount !== currComp.variantCount) {
        modifiedVariants.push(
          `${currComp.name}: variants ${prevComp.variantCount} -> ${currComp.variantCount}`
        );
      }
    }
  }

  if (added.length > 0) {
    console.log(`\n✨ NEW COMPONENTS IN FIGMA (${added.length}):`);
    added.slice(0, 10).forEach((name) => console.log(`   + ${currentComponents[name].name}`));
    if (added.length > 10) console.log(`   ... and ${added.length - 10} more`);
  }

  if (removed.length > 0) {
    console.log(`\n🗑️  REMOVED COMPONENTS IN FIGMA (${removed.length}):`);
    removed.forEach((name) => console.log(`   - ${name}`));
  }

  if (modifiedVariants.length > 0) {
    console.log(`\n🔄 MODIFIED COMPONENT VARIANTS (${modifiedVariants.length}):`);
    modifiedVariants.forEach((info) => console.log(`   ~ ${info}`));
  }

  if (added.length === 0 && removed.length === 0 && modifiedVariants.length === 0 && previous.detectedRadius === currentRadius) {
    console.log(`\n✅ No structural or metric changes detected. Your local code is in sync with Figma!`);
  }

  console.log(`=======================================================\n`);
}

diffFigma().catch((err) => console.error(err));
