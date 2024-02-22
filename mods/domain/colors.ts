import { assertObject, assertRequiredString } from "../common/asserts.ts";

export interface Color {
  key: string;
  name: string;
}

export const colors: Color[] = [
  { key: "black", name: "Black" },
  { key: "blue", name: "Blue" },
  { key: "green", name: "Green" },
  { key: "red", name: "Red" },
  { key: "yellow", name: "Yellow" },
] as const;

export type ColorKey = "black" | "blue" | "green" | "red" | "yellow";

export const colorByKeys = new Map<string, Color>(
  colors.map((color) => [color.key, color])
);

export function assertColor(key: unknown, msg: string): asserts key is ColorKey {
  assertRequiredString(key, 'color-must-be-required-string');
  const color = colorByKeys.get(key);
  assertObject(color, msg);
} 
