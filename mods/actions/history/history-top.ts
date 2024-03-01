import { div_nodes, div_text } from "../../common/frontend-framework/dom.ts";
import { SelectorOption, SelectorStore, createSelector } from "../../apps/client/features/selector.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { providePlayingGame } from "../playing/common.ts";

export function provideHistoryPlayerStore(resolver: ServiceResolver) {
  const playingGame = resolver.resolve(providePlayingGame);
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
    readonly historyPlayerStore: SelectorStore
  ) {
    this.$root = div_nodes("top _with-controller", [
      div_text("top_label", "History"),
      div_nodes("top_controller", [
        createSelector(historyPlayerStore),
      ]),
    ]);
  }
}

export function provideHistoryTop(resolver: ServiceResolver) {
  return new HistoryTop(
    resolver.resolve(provideHistoryPlayerStore)
  );
}
