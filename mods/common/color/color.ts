import { EnumLayout } from "@acme/layout/types/enum-layout.ts";
import { InferLayout } from "@acme/layout/common.ts";

export interface Color {
  key: string;
  name: string;
}

export const colors = [
  { key: "black", name: "Black" },
  { key: "blue", name: "Blue" },
  { key: "green", name: "Green" },
  { key: "red", name: "Red" },
  { key: "yellow", name: "Yellow" },
] as const;

export const colorLayout = new EnumLayout(
  { id: "color", summary: "One of the five colors" },
  colors.map((color) => color.key),
);

export type ColorKey = InferLayout<typeof colorLayout>;
