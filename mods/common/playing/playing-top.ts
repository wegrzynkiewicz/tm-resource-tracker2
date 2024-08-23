import { div_nodes, div_text } from "../../core/frontend-framework/dom.ts";
import { SelectorOption, SelectorStore, createSelector } from "../../app-client/src/selector.ts";
import { ServiceResolver } from "../../core/dependency.ts";
import { providePlayingGame } from "./common.ts";

export function providePlayingPlayerStore(resolver: ServiceResolver) {
  const playingGame = resolver.resolve(providePlayingGame);
  const options: SelectorOption[] = [];
  for (const { color, name } of playingGame.players) {
    options.push({ key: color, name });
  }
  return new SelectorStore(options);
}

export class PlayingTop {
  public readonly $root: HTMLDivElement;
  private readonly $label: HTMLDivElement;
  public constructor(
    readonly playerIndex: SelectorStore,
  ) {
    this.$label = div_text("top_label", "TM Resource Tracker v2");
    this.$root = div_nodes("top _with-controller", [
      this.$label,
      div_nodes("top_controller", [
        createSelector(playerIndex),
      ]),
    ]);
  }

  public setLabel(label: string) {
    this.$label.textContent = label;
  }
}

export function providePlayingTop(resolver: ServiceResolver) {
  return new PlayingTop(
    resolver.resolve(providePlayingPlayerStore),
  );
}
