import { GameStage, gameStageGADef } from "./common.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { provideGADispatcher } from "../../../common/communication/dispatcher.ts";
import { PlayerBroadcast } from "../../player/broadcast.ts";
import { providePlayerBroadcast } from "../../player/broadcast.ts";
import { ServerPlayerContext } from "../../player/server/context.ts";

export class GameStageBroadcast {
  public constructor(
    private readonly playerBroadcast: PlayerBroadcast,
  ) { }

  public sendToPlayers(stage: GameStage) {
    this.playerBroadcast.send(gameStageGADef, { stage });
  }

  public sendToPlayerWithContext(playerContext: ServerPlayerContext) {
    const dispatcher = playerContext.resolver.resolve(provideGADispatcher)
    dispatcher.send(gameStageGADef, { stage: "waiting" });
  }
}

export function provideGameStageBroadcast(resolver: ServiceResolver) {
  return new GameStageBroadcast(
    resolver.resolve(providePlayerBroadcast),
  );
}
