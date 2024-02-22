import { div_nodes } from "../../../../common/frontend-framework/dom.ts";

export function createPanel(nodes: Node[]) {
  const $root = div_nodes("panel", nodes.map((node) => div_nodes("panel_item", [node])));
  $root.addEventListener("pointerdown", (event) => {
    console.log("panel pointerdown", event);
  });
  $root.addEventListener("pointerup", (event) => {
    console.log("panel pointerup", event);
  });
  $root.addEventListener("pointermove", (event) => {
    console.log("panel pointermove", event);
  });
  return $root;
}
