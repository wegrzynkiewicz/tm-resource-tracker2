import { colors } from "../../domain/colors.ts";
import { div_nodes, span_props } from "../../frontend-framework/dom.ts";
import { createSelector } from "../features/selector.ts";

export function createColorSelectorBox() {
  const color = createSelector(colors);
  const $root = div_nodes("edit-box _selector", [
    span_props({
      className: "edit-box_label",
      textContent: "Color",
    }),
    color.$root,
  ]);
  return { $root, store: color.store };
}
