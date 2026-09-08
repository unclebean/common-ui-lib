export interface FigmaToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "OBJECT";
    properties: Record<
      string,
      {
        type: "STRING" | "NUMBER" | "BOOLEAN" | "ARRAY" | "OBJECT";
        description: string;
        enum?: string[];
      }
    >;
    required?: string[];
  };
}

export interface FigmaToolResult {
  content: Array<{
    type: "text" | "image";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface SimplifiedFigmaNode {
  id: string;
  name: string;
  type: string;
  layout?: {
    mode?: "HORIZONTAL" | "VERTICAL" | "NONE";
    spacing?: number;
    padding?: { top?: number; right?: number; bottom?: number; left?: number };
    align?: string;
    justify?: string;
    width?: number;
    height?: number;
  };
  style?: {
    fills?: string[];
    strokes?: string[];
    cornerRadius?: number;
    opacity?: number;
  };
  text?: {
    characters?: string;
    fontSize?: number;
    fontWeight?: number | string;
    textAlign?: string;
  };
  children?: SimplifiedFigmaNode[];
}
