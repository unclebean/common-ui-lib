import tokensData from "./tokens.json";
export { default as commonUIPreset } from "./tailwind-preset";

export const tokens = tokensData;
export type Tokens = typeof tokensData;
