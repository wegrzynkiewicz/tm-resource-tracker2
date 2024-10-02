import { createSelector, SelectorOption, SelectorStore } from "../../app-client/src/frontend/utils/selector.ts";
import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { providePlayingGame } from "../playing/common.ts";

export function provideHistoryPlayerStore(resolver: DependencyResolver) {
  const playingGame = resolver.resolve(playingGameDependency);
  const options: SelectorOption[] = [];
  options.push({ key: "all", name: "All players" });
  for (const { color, name } of playingGame.players) {
    options.push({ key: color, name });
  }
  return new SelectorStore(options);
}

export class HistoryTop {
  public readonly $root: HTMLDivElement;
  public constructor(
    readonly historyPlayerStore: SelectorStore,
  ) {
    this.$root = div_nodes("top _with-controller", [
      div("top_label", "History"),
      div_nodes("top_controller", [
        createSelector(historyPlayerStore),
      ]),
    ]);
  }
}

export function provideHistoryTop(resolver: DependencyResolver) {
  return new HistoryTop(
    resolver.resolve(historyPlayerStoreDependency),
  );
}
