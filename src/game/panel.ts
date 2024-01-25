import { div_nodes } from "../common/dom.ts";

export function createPanel(nodes: Node[]) {
  return div_nodes("panel", nodes.map((node) => div_nodes("panel_item", [node])));
}
