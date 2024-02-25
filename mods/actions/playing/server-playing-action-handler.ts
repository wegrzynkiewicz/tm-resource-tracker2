import { GAHandler } from "../../common/communication/define.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { examples } from "../history/common.ts";
import { ClientGameContext, provideClientGameContext } from "../game/client/context.ts";
import { historyEntryCreatedChannel } from "../history/history-item.ts";
import { provideHistoryView } from "../history/history-view.ts";
import { provideProjectsView } from "../projects/projects-view.ts";
import { provideSupplyView } from "../supply/supply-view.ts";
import { PlayingGameGA, providePlayingGame } from "./common.ts";
import { provideToolbarSwitcher } from "./toolbar.ts";

export class ServerPlayingGameGAHandler implements GAHandler<PlayingGameGA>{
  public constructor(
    private readonly clientGameContext: ClientGameContext,
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

    historyEntryCreatedChannel.emit(examples[0]);
    historyEntryCreatedChannel.emit(examples[1]);
    historyEntryCreatedChannel.emit(examples[2]);
    historyEntryCreatedChannel.emit(examples[3]);
    
    supplies.render();
  }
}

export function provideServerPlayingGameGAHandler(resolver: ServiceResolver) {
  return new ServerPlayingGameGAHandler(
    resolver.resolve(provideClientGameContext),
  );
}
