import { div_nodes } from "../../../frontend-framework/dom.ts";

export function createPanel(nodes: Node[]) {
  return div_nodes("panel", nodes.map((node) => div_nodes("panel_item", [node])));
}