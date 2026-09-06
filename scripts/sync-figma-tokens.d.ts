/**
 * Figma Variables -> shadcn / CSS Token Synchronizer
 *
 * This script accepts Figma Local Variables (via Figma REST API or Figma MCP output),
 * converts color objects {r, g, b, a} to CSS HSL strings, and writes to
 * src/tokens/tokens.json and src/tokens/globals.css.
 */
export declare function figmaRgbaToHsl(r: number, g: number, b: number): string;
interface FigmaVariable {
    id: string;
    name: string;
    resolvedType: "COLOR" | "FLOAT" | "STRING";
    valuesByMode: Record<string, any>;
}
export declare function parseFigmaVariables(rawVariables: Record<string, FigmaVariable>, modeMapping: {
    lightModeId: string;
    darkModeId: string;
}): {
    lightColors: Record<string, string>;
    darkColors: Record<string, string>;
    radius: string;
};
export {};
