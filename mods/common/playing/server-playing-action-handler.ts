import { GAHandler } from "../../core/communication/define.ts";
import { ServiceResolver } from "../../core/dependency.ts";
import { HistoryEntry, examples } from "../history/common.ts";
import { ClientGameContext, provideClientGameContext } from "../game/client/context.ts";
import { provideHistoryChannel } from "../history/history-item.ts";
import { provideHistoryView } from "../history/history-view.ts";
import { provideProjectsView } from "../projects/projects-view.ts";
import { provideSupplyView } from "../supply/supply-view.ts";
import { PlayingGameGA, providePlayingGame } from "./common.ts";
import { provideToolbarSwitcher } from "./toolbar.ts";
import { Channel } from "../../core/channel.ts";

export class ServerPlayingGameGAHandler implements GAHandler<PlayingGameGA>{
  public constructor(
    private readonly clientGameContext: ClientGameContext,
    private readonly historyChannel: Channel<HistoryEntry>,
  ) { }

  public async handle(input: PlayingGameGA): Promise<void> {
    const { resolver } = this.clientGameContext;
    resolver.inject(providePlayingGame, input);

    const signal = resolver.resolve(provideToolbarSwitcher);
    const supplies = resolver.resolve(provideSupplyView);
    const projects = resolver.resolve(provideProjectsView);
    const histories = resolver.resolve(provideHistoryView);
    signal.on((key) => {
      switch (key) {
        case "supplies": return supplies.render();
        case "projects": return projects.render();
        case "histories": return histories.render();
      }
    });

    this.historyChannel.emit(examples[0]);
    this.historyChannel.emit(examples[1]);
    this.historyChannel.emit(examples[2]);
    this.historyChannel.emit(examples[3]);
    
    supplies.render();
  }
}

export function provideServerPlayingGameGAHandler(resolver: ServiceResolver) {
  return new ServerPlayingGameGAHandler(
    resolver.resolve(provideClientGameContext),
    resolver.resolve(provideHistoryChannel),
  );
}
