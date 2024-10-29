import { Context } from "@acme/dependency/service-resolver.ts";
import { PlayerBroadcast } from "../../player/player-broadcast.ts";
import { providePlayerBroadcast } from "../../player/player-broadcast.ts";
import { ServerPlayerContext } from "../../player/server/context.ts";
import { provideWaitingGameStage } from "../../player/waiting/waiting-game-stage.ts";
import { GameStage } from "./common.ts";

export class GameStageManager {
  public constructor(
    public playerBroadcast: PlayerBroadcast,
    public stage: GameStage,
  ) {}

  public handlePlayerContextCreation(context: ServerPlayerContext) {
    this.stage.handlePlayerContextCreation(context);
  }

  public handlePlayerContextDeletion(context: ServerPlayerContext) {
    this.stage.handlePlayerContextDeletion(context);
  }

  public setStage(stage: GameStage) {
    this.stage = stage;
    this.stage.run();
  }
}

export function provideGameStageManager(context: Context) {
  return new GameStageManager(
    context.resolve(playerBroadcastDependency),
    context.resolve(waitingGameStageDependency),
  );
}
