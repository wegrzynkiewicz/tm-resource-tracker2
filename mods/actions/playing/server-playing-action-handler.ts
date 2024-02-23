import { GAHandler } from "../../common/communication/define.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { ClientGameContext, provideClientGameContext } from "../game/client/context.ts";
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
    signal.on((key) => {
      switch (key) {
        case "supplies": return supplies.render();
        case "projects": return projects.render();
      }
    });
    supplies.render();
  }
}

export function provideServerPlayingGameGAHandler(resolver: ServiceResolver) {
  return new ServerPlayingGameGAHandler(
    resolver.resolve(provideClientGameContext),
  );
}
