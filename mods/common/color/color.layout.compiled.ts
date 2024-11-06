import { LayoutResult, notMatchedErrorContract } from "@framework/layout/runtime/mod.ts";

export const colorKeyObject: Record<string, 1> = {
  ["black"]: 1,
  ["blue"]: 1,
  ["green"]: 1,
  ["red"]: 1,
  ["yellow"]: 1,
};
export const colorKeyValues = /** @__PURE__ */ Object.keys(colorKeyObject);

export type ColorKey = "black" | "blue" | "green" | "red" | "yellow";

export const parseColor = (data: unknown, path: string = ""): LayoutResult<ColorKey> => {
  let output;
  while (true) {
    if (typeof data === "string" && colorKeyObject[data]) {
      output = data as ColorKey;
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
