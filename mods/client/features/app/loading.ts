import { div_text } from "../../../frontend-framework/dom.ts";

export function createLoading() {
  const $root = div_text("loading", "Loading...");
  return $root;
}
