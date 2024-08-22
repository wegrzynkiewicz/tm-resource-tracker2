import { colors } from "./color.ts";
import { div_nodes, span_props } from "../../core/frontend-framework/dom.ts";
import { SelectorStore, createSelector } from "../../app-client/src/selector.ts";

export function createColorSelectorBox() {
  const store = new SelectorStore(colors);
  const $selector = createSelector(store);
  const $root = div_nodes("edit-box _selector", [
    span_props({
      className: "edit-box_label",
      textContent: "Color",
    }),
    $selector,
  ]);
  return { $root, store };
}
