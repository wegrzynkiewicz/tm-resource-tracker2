import { provideGADispatcher } from "../../../core/communication/dispatcher.ts";
import { Context } from "@acme/dependency/service-resolver.ts";
import { GameStage } from "../../game/stage/common.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../player-broadcast.ts";
import { ServerPlayerContext } from "../server/context.ts";
import { waitingGameStageGADef } from "./common.ts";
import { waitingPlayersGADef } from "./common.ts";

export class WaitingGameStage implements GameStage {
  public readonly kind = "waiting";

  public constructor(
    private readonly playerBroadcast: PlayerBroadcast,
  ) {}

  public handlePlayerContextCreation(context: ServerPlayerContext) {
    const { resolver } = context;
    const dispatcher = context.resolve(gADispatcherDependency);
    dispatcher.send(waitingGameStageGADef, null);
    this.broadcastPlayers();
  }

  public handlePlayerContextDeletion() {
    this.broadcastPlayers();
  }

  public broadcastPlayers() {
    const players = [...this.playerBroadcast.fetchOnlinePlayers()];
    this.playerBroadcast.send(waitingPlayersGADef, { players });
  }

  public run() {
    this.playerBroadcast.send(waitingGameStageGADef, null);
    this.broadcastPlayers();
  }
}

export function provideWaitingGameStage(context: Context) {
  return new WaitingGameStage(
    context.resolve(playerBroadcastDependency),
  );
}
