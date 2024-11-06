import { div_nodes, span } from "@framework/dom/nodes.ts";
import { colors } from "@common/color/color.ts";
import { ArrayStore } from "@framework/dom/array-store.ts";
import { NumberStore } from "@framework/dom/number-store.ts";
import { createSelector } from "./selector.ts";

export const colorStore = new ArrayStore(colors);

export function createColorSelectorBox() {
  const indexStore = new NumberStore();
  const selector = createSelector(indexStore, colorStore);
  const $root = div_nodes("edit-box _selector", [
    span("edit-box_label", "Color"),
    selector.$root,
  ]);
  selector.moves.on((move) => indexStore.add(move));
  const dispose = () => {
    selector.dispose();
  };
  return { $root, dispose, selector };
}
