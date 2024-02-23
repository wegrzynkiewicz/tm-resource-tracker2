import { GAHandler } from "../../common/communication/define.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { ClientGameContext, provideClientGameContext } from "../game/client/context.ts";
import { provideSupplyView } from "../supply/supply-view.ts";
import { PlayingGameGA, providePlayingGame } from "./common.ts";

export class ServerPlayingGameGAHandler implements GAHandler<PlayingGameGA>{
  public constructor(
    private readonly clientGameContext: ClientGameContext,
  ) { }

  public async handle(input: PlayingGameGA): Promise<void> {
    const { resolver } = this.clientGameContext;
    resolver.inject(providePlayingGame, input);
    const supply = resolver.resolve(provideSupplyView);
    supply.render();
  }
}

export function provideServerPlayingGameGAHandler(resolver: ServiceResolver) {
  return new ServerPlayingGameGAHandler(
    resolver.resolve(provideClientGameContext),
  );
}
