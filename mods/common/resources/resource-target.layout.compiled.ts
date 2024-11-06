import { LayoutResult, notMatchedErrorContract } from "@framework/layout/runtime/mod.ts";

export const resourceTargetObject: Record<string, 1> = {
  ["amount"]: 1,
  ["production"]: 1,
};
export const resourceTargetValues = /** @__PURE__ */ Object.keys(resourceTargetObject);

export type ResourceTarget = "amount" | "production";

export const parseResourceTarget = (data: unknown, path: string = ""): LayoutResult<ResourceTarget> => {
  let output;
  while (true) {
    if (typeof data === "string" && resourceTargetObject[data]) {
      output = data as ResourceTarget;
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
