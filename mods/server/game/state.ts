import { gameStageGADef } from "../../action/game-stage-ga.ts";
import { Handler } from "../../common/channel.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { createResourceGroup } from "../../common/resources.ts";
import { provideGADispatcher } from "../../communication/dispatcher.ts";
import { PlayerBroadcast } from "../player/broadcast.ts";
import { providePlayerBroadcast } from "../player/broadcast.ts";
import { ServerPlayerContext } from "../player/context.ts";

export class PlayerState {
  public readonly resources = createResourceGroup(20);
  public readonly buildings = new Map<string, number>();
}

export class GameState {
  public readonly players = new Map<string, PlayerState>();
}

export class HistoryState {
}

export class GameStateBroadcast implements Handler<ServerPlayerContext> {
  public constructor(
    private readonly playerBroadcast: PlayerBroadcast,
  ) { }

  public handle(playerContext: ServerPlayerContext) {
    const dispatcher = playerContext.resolver.resolve(provideGADispatcher)
    dispatcher.send(gameStageGADef, { stage: "waiting" });
  }
}

export function provideGameStateBroadcast(resolver: ServiceResolver) {
  return new GameStateBroadcast(
    resolver.resolve(providePlayerBroadcast),
  );
}
