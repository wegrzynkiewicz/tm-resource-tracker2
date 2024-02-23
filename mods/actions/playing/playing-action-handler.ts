import { GAHandler } from "../../common/communication/define.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { ClientGameContext, provideClientGameContext } from "../game/client/context.ts";
import { PlayingGameGA, providePlayingGame } from "./common.ts";
import { provideToolbarView } from "./toolbar-view.ts";

export class PlayingGameGAHandler implements GAHandler<PlayingGameGA>{
  public constructor(
    private readonly clientGameContext: ClientGameContext,
  ) { }

  public async handle(input: PlayingGameGA): Promise<void> {
    const { resolver } = this.clientGameContext;

    resolver.inject(providePlayingGame, input);

    const toolbar = resolver.resolve(provideToolbarView);
    {
      const supplyViewRenderer = resolver.resolve(provideSupplyView);
      toolbar.signal.on((key) => {
        switch (key) {
          case "supplies": {
            supplyViewRenderer.render();
            break;
          }
          case "projects":
          case "histories":
          case "settings":
        }
      })
    }
  }
}

export function providePlayingGameGAHandler(resolver: ServiceResolver) {
  return new PlayingGameGAHandler(
    resolver.resolve(provideClientGameContext),
  );
}
