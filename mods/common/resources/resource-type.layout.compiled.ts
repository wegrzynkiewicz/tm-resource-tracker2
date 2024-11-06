import { LayoutResult, notMatchedErrorContract } from "@framework/layout/runtime/mod.ts";

export const resourceTypeObject: Record<string, 1> = {
  ["points"]: 1,
  ["gold"]: 1,
  ["steel"]: 1,
  ["titan"]: 1,
  ["plant"]: 1,
  ["energy"]: 1,
  ["heat"]: 1,
};
export const resourceTypeValues = /** @__PURE__ */ Object.keys(resourceTypeObject);

export type ResourceType = "points" | "gold" | "steel" | "titan" | "plant" | "energy" | "heat";

export const parseResourceType = (data: unknown, path: string = ""): LayoutResult<ResourceType> => {
  let output;
  while (true) {
    if (typeof data === "string" && resourceTypeObject[data]) {
      output = data as ResourceType;
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
