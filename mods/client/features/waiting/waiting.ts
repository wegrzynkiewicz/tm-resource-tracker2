import { div_nodes, div_text } from "../../../frontend-framework/dom.ts";

export class WaitingView {
  public readonly $root: HTMLDivElement;
  public constructor() {
    this.$root = div_nodes("waiting", [
      div_nodes("waiting_container", [
        div_text("waiting_title", "Waiting for the game to start..."),
      ]),
    ]);
  }
}
