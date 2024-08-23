import { createPanel } from "../../app-client/src/app/panel.ts";
import { SelectorStore } from "../../app-client/src/selector.ts";
import { Channel } from "../../core/channel.ts";
import { ServiceResolver } from "../../core/dependency.ts";
import { PlayingGame, providePlayingGame } from "../playing/common.ts";
import { PlayingAppView } from "../playing/playing-app-view.ts";
import { providePlayingAppView } from "../playing/playing-app-view.ts";
import { HistoryEntry } from "./common.ts";
import { HistoryShowAll, HistoryShowPlayer } from "./history-item.ts";
import { HistoryItemView, provideHistoryChannel } from "./history-item.ts";
import { HistoryTop, provideHistoryPlayerStore, provideHistoryTop } from "./history-top.ts";

export class HistoryView {
  public readonly items: HistoryItemView[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly app: PlayingAppView,
    private readonly top: HistoryTop,
    private readonly playingGame: PlayingGame,
    private readonly historyChannel: Channel<HistoryEntry>,
    private readonly historyPlayerStore: SelectorStore,
  ) {
    this.items = [];
    const all = new HistoryItemView(
      historyChannel,
      new HistoryShowAll(),
    );
    this.items.push(all);
    for (const player of playingGame.players) {
      const item = new HistoryItemView(
        historyChannel,
        new HistoryShowPlayer(player.playerId),
      );
      this.items.push(item);
    }
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(historyPlayerStore, roots);
  }

  public render() {
    this.app.render(
      this.top.$root,
      this.$root
    );
  }
}

export function provideHistoryView(resolver: ServiceResolver) {
  return new HistoryView(
    resolver.resolve(providePlayingAppView),
    resolver.resolve(provideHistoryTop),
    resolver.resolve(providePlayingGame),
    resolver.resolve(provideHistoryChannel),
    resolver.resolve(provideHistoryPlayerStore),
  );
}