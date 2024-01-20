import { div_nodes, div_text, span_props, span_text } from "../common/dom.ts";
import { svg_icon } from "../common/svg.ts";

export function createTop() {
  return div_nodes("top --with-controller", [
    div_text("top__label", "Player's supplies"),
    div_nodes("top__controller", [
      div_nodes("selector", [
        svg_icon("selector__icon", "arrow-left"),
        div_nodes("selector__content", [
          span_props({className: "player-cube", style: "--background: var(--color-player-cube-green)"}),
          span_text("text", "Łukasz"),
        ]),
        svg_icon("selector__icon", "arrow-right"),
      ]),
    ]),
  ]);
}
