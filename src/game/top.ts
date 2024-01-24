import { div_nodes, div_text, span_props, span_text } from "../common/dom.ts";
import { svg_icon } from "../common/svg.ts";

export function createTop() {
  return div_nodes("top _with-controller", [
    div_text("top_label", "Player's supplies"),
    div_nodes("top_controller", [
    ]),
  ]);
}
