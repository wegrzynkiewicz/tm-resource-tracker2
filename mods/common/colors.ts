export interface Color {
  key: string;
  name: string;
}

export const colors: Color[] = [
  { key: "green", name: "Green" },
  { key: "red", name: "Red" },
  { key: "blue", name: "Blue" },
  { key: "yellow", name: "Yellow" },
  { key: "black", name: "Black" },
];

export const colorByKeys = new Map<string, Color>(
  colors.map((color) => [color.key, color])
);
