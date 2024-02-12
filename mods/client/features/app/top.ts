import { colors } from "../../../common/colors.ts";
import { div_nodes, div_text } from "../../../frontend-framework/dom.ts";
import { Store } from "../../../frontend-framework/store.ts";
import { createSelector } from "../selector.ts";

class TopStore extends Store {
  constructor() {
    super();
  }
}

export class Top {
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

export function provideTop() {
  return new TopStore();
}
