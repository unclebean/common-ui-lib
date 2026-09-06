# Common UI Library (`@common/ui-lib`)

An enterprise-grade design system and UI component library built on **shadcn/ui specifications + Design Tokens + Figma MCP automation**.

---

## Key Features

- 🎨 **Figma Design Tokens Integration**: Colors (`--primary`, `--muted`, etc.), border radii (`--radius`), and chart palettes (`--chart-1` to `--chart-5`) mapped 1:1 to Figma Local Variables.
- 📈 **Financial Portfolio Visualizations & Data Tables**:
  - **Portfolio Charts**: Built on Recharts, including Net Asset Value (NAV) Area Charts and Asset Allocation Donut Charts, with full dark mode and CSS variable responsiveness.
  - **Asset Holdings Table**: Powered by TanStack Table (React Table v8), featuring interactive multi-column sorting, formatting, and bullish/bearish indicator badges.
- 🧩 **Comprehensive Foundation & Form Controls**:
  - `Dialog` accessible modal dialog system
  - `Form` declarative form validation engine powered by `react-hook-form` + `zod`
  - `Button`, `Input`, `Label`, `Checkbox`, `RadioGroup`, `Select`, `DropdownMenu`, `Calendar`, `Popover`, `Card`, `Badge`
- 🏷️ **Modular SVG Brand Logo**: Configurable sizing, icon/full variants, and token-aware styling for seamless branding customization.
- 🔄 **Figma MCP / Automation Synchronizer**: Includes `.figma/config.json` configuration and `scripts/sync-figma-tokens.ts` utility.

---

## Quick Start (Playground & Storybook)

```bash
# 1. Install dependencies (including Storybook)
npm install

# 2. Launch Storybook (Component Catalog & Visual Documentation)
npm run storybook

# 3. Launch interactive sandbox (Integrated Dashboard Playground)
npm run dev

# 4. Compile and build library package
npm run build

# 5. Build static Storybook site
npm run build-storybook
```

---

## Figma Token Synchronization

1. Create your local environment configuration by copying the template:
   ```bash
   cp .env.example .env
   ```
2. Populate `FIGMA_PERSONAL_ACCESS_TOKEN` in `.env` (generate in Figma: *Settings -> Security -> Personal access tokens*).
3. Run the automated synchronization:
   ```bash
   npm run sync:figma
   ```
*(Note: `.env` and `.figma/tokens.raw.json` are git-ignored to prevent credential exposure).*

---

## Production Publishing & Integration Guide

For detailed step-by-step instructions on publishing to private NPM repositories (Artifactory, GitHub Packages) and consuming this library in downstream projects, refer to the Standard Operating Procedure:

👉 **[SOP: Private NPM Publishing & Downstream Integration Guide](docs/SOP_PUBLISH_AND_CONSUME.md)**

---

## Project Structure

```plaintext
common-ui-lib/
├── .figma/                     # Figma sync configuration & cached mirrors
│   └── config.json
├── docs/                       # Technical specifications & SOP documents
│   └── SOP_PUBLISH_AND_CONSUME.md
├── scripts/                    # Automation scripts
│   └── sync-figma-tokens.ts    # Figma API / MCP variable parser
├── src/
│   ├── tokens/                 # Design Tokens layer
│   │   ├── tokens.json         # Structured tokens (colors, radii, charts)
│   │   ├── globals.css         # CSS variables (:root & .dark)
│   │   └── tailwind-preset.ts  # Exportable Tailwind preset for downstream apps
│   ├── components/
│   │   ├── brand/              # Brand identity components (Logo)
│   │   └── ui/                 # Atomic & molecular UI components
│   ├── finance/                # Financial domain widgets (PortfolioChart, AssetTable)
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn helper)
│   ├── playground/             # Interactive local showcase workbench
│   └── index.ts                # Main library export entrypoint
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```
