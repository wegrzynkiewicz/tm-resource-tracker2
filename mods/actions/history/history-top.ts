import { div_nodes, div_text } from "../../common/frontend-framework/dom.ts";
import { SelectorOption, createSelector } from "../../apps/client/features/selector.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { PlayingGame, providePlayingGame } from "../playing/common.ts";

export class HistoryTop {
  public readonly $root: HTMLDivElement;
  private readonly $label: HTMLDivElement;
  public constructor(
    readonly playingGame: PlayingGame
  ) {
    this.$label = div_text("top_label", "History");
    
    const options: SelectorOption[] = [];
    options.push({ key: "all", name: "All players" });
    for (const { color, name } of playingGame.players) {
      options.push({ key: color, name });
    }
    const color = createSelector(options);

    this.$root = div_nodes("top _with-controller", [
      this.$label,
      div_nodes("top_controller", [
        color.$root,
      ]),
    ]);
  }
}

export function provideHistoryTop(resolver: ServiceResolver) {
  return new HistoryTop(
    resolver.resolve(providePlayingGame),
  );
}
