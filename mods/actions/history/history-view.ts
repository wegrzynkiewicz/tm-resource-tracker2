import { createPanel } from "../../apps/client/features/app/panel.ts";
import { Channel } from "../../common/channel.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { PlayingGame, providePlayingGame } from "../playing/common.ts";
import { PlayingAppView } from "../playing/playing-app-view.ts";
import { providePlayingAppView } from "../playing/playing-app-view.ts";
import { HistoryEntry } from "./common.ts";
import { HistoryShowAll, HistoryShowPlayer } from "./history-item.ts";
import { HistoryItemView, provideHistoryChannel } from "./history-item.ts";
import { HistoryTop, provideHistoryTop } from "./history-top.ts";

export class HistoryView {
  public readonly items: HistoryItemView[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly app: PlayingAppView,
    private readonly top: HistoryTop,
    private readonly playingGame: PlayingGame,
    private readonly historyChannel: Channel<HistoryEntry>,
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
    this.$root = createPanel(roots);
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
  );
}
