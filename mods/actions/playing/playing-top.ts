import { div_nodes, div_text } from "../../common/frontend-framework/dom.ts";
import { createSelector } from "../../apps/client/features/selector.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { PlayingGame, providePlayingGame } from "./common.ts";

export class PlayingTop {
  public readonly $root: HTMLDivElement;
  private readonly $label: HTMLDivElement;
  public constructor(
    readonly playingGame: PlayingGame
  ) {
    this.$label = div_text("top_label", "TM Resource Tracker v2");
    const options = playingGame.players.map(({ color, name }) => ({
      key: color,
      name
    }));
    const color = createSelector(options);

    this.$root = div_nodes("top _with-controller", [
      this.$label,
      div_nodes("top_controller", [
        color.$root,
      ]),
    ]);
  }

  public setLabel(label: string) {
    this.$label.textContent = label;
  }
}

export function providePlayingTop(resolver: ServiceResolver) {
  return new PlayingTop(
    resolver.resolve(providePlayingGame),
  );
}
