import { div_nodes, div_text } from "../../frontend-framework/dom.ts";
import { Store } from "../../frontend-framework/store.ts";

class TopStore extends Store {
  constructor() {
    super();
  }
}

export function createTop() {
  return div_nodes("top _with-controller", [
    div_text("top_label", "Player's supplies"),
    div_nodes("top_controller", [
    ]),
  ]);
}
