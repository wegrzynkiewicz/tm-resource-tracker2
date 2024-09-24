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
