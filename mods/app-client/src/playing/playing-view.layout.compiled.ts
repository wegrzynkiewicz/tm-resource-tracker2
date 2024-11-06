import { LayoutResult, notMatchedErrorContract } from "@framework/layout/runtime/mod.ts";

export const playingViewObject: Record<string, 1> = {
  ["resources"]: 1,
  ["projects"]: 1,
  ["histories"]: 1,
  ["settings"]: 1,
};
export const playingViewValues = /** @__PURE__ */ Object.keys(playingViewObject);

export type PlayingView = "resources" | "projects" | "histories" | "settings";

export const parsePlayingView = (data: unknown, path: string = ""): LayoutResult<PlayingView> => {
  let output;
  while (true) {
    if (typeof data === "string" && playingViewObject[data]) {
      output = data as PlayingView;
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
