import { colors } from "../../common/colors.ts";
import { div_nodes, label_props } from "../../frontend-framework/dom.ts";
import { createSelector } from "../features/selector.ts";

export function createColorSelectorBox() {
  const color = createSelector(colors);
  const $root = div_nodes('edit-box _selector', [
    label_props({
      className: 'edit-box_label',
      for: 'color',
      textContent: 'Color'
    }),
    color.$root,
  ]);
  return { $root, store: color.store };
} 
