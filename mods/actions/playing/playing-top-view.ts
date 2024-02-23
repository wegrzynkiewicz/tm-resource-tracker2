import { colors } from "../color/color.ts";
import { div_nodes, div_text } from "../../common/frontend-framework/dom.ts";
import { createSelector } from "../../apps/client/features/selector.ts";

export class PlayingTopView {
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

export function providePlayingTopView() {
  return new PlayingTopView();
}
