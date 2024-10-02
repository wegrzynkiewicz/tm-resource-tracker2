import { div_nodes, span } from "@acme/dom/nodes.ts";
import { colors } from "@common/color/color.ts";
import { SelectorStore, createSelector } from "./selector.ts";

export function createColorSelectorBox(name: string) {
  const store = new SelectorStore([...colors]);
  const $selector = createSelector(name, store);
  const $root = div_nodes("edit-box _selector", [
    span("edit-box_label", "Color"),
    $selector,
  ]);
  return { $root, store };
}
