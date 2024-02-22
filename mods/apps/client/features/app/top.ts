import { colors } from "../../../../actions/color/color.ts";
import { div_nodes, div_text } from "../../../../common/frontend-framework/dom.ts";
import { Store } from "../../../../common/frontend-framework/store.ts";
import { createSelector } from "../selector.ts";

class TopStore extends Store {
  constructor() {
    super();
  }
}

export class TopView {
  public readonly $root: HTMLDivElement;
  protected readonly $label: HTMLDivElement;
  protected readonly $controller: HTMLDivElement;
  public constructor() {
    this.$label = div_text("top_label", "TM Resource Tracker v2");
    const color = createSelector(colors);
    this.$controller = div_nodes("top_controller", [
      color.$root,
    ]);

    this.$root = div_nodes("top", [
      this.$label,
      //   this.$controller,
    ]);
  }

  public setLabel(label: string) {
    this.$label.textContent = label;
  }
}

export function provideTopView() {
  return new TopView();
}
