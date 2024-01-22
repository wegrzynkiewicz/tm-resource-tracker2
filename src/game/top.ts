import { div_nodes, div_text, span_props, span_text } from "../common/dom.ts";
import { svg_icon } from "../common/svg.ts";

export function createTop() {
  return div_nodes("top --with-controller", [
    div_text("top__label", "Player's supplies"),
    div_nodes("top__controller", [
    ]),
  ]);
}
