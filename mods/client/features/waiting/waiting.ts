import { div_nodes } from "../../../frontend-framework/dom.ts";

export class WaitingView {
  public readonly $root: HTMLDivElement;
  public constructor() {
    this.$root = div_nodes("waiting", []);
  }
}
