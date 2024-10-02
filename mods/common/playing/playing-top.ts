import { createSelector, SelectorOption, SelectorStore } from "../../app-client/src/frontend/utils/selector.ts";
import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { providePlayingGame } from "./common.ts";

export function providePlayingPlayerStore(resolver: DependencyResolver) {
  const playingGame = resolver.resolve(playingGameDependency);
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
    this.$label = div("top_label", "TM Resource Tracker v2");
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

export function providePlayingTop(resolver: DependencyResolver) {
  return new PlayingTop(
    resolver.resolve(playingPlayerStoreDependency),
  );
}
