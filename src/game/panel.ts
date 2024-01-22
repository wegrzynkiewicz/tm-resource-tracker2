import { mapToFragment } from "../common";
import { div_nodes } from "../common/dom";

export function createPanel(nodes: Node[]) {
  return div_nodes("panel", [
    mapToFragment(nodes, (node) => div_nodes("panel__item", [node])),
  ]);
}
