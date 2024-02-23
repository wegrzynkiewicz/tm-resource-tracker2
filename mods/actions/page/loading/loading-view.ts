import { div_text } from "../../../common/frontend-framework/dom.ts";

export function provideLoadingView() {
  const $root = div_text("loading", "Loading...");
  return { $root };
}
