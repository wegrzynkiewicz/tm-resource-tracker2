import { mapToFragment } from "../common.ts";
import { div_nodes } from "../common/dom.ts";

export function createPanel(nodes: Node[]) {
  return div_nodes("panel", [
    mapToFragment(nodes, (node) => div_nodes("panel_item", [node])),
  ]);
}
