import { ServiceResolver } from "../../../common/dependency.ts";
import { GameStage } from "../../game/stage/common.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../player-broadcast.ts";
import { waitingPlayersGADef } from "./common.ts";

export class WaitingGameStage implements GameStage {
  public readonly kind = 'waiting';

  public constructor(
    private readonly playerBroadcast: PlayerBroadcast,
  ) { }

  public handlePlayerContextCreation() {
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
    this.broadcastPlayers();
  }
}

export function provideWaitingGameStage(resolver: ServiceResolver) {
  return new WaitingGameStage(
    resolver.resolve(providePlayerBroadcast),
  );
}
