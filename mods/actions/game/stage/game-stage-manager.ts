import { provideGADispatcher } from "../../../common/communication/dispatcher.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { PlayerBroadcast } from "../../player/player-broadcast.ts";
import { providePlayerBroadcast } from "../../player/player-broadcast.ts";
import { ServerPlayerContext } from "../../player/server/context.ts";
import { provideWaitingGameStage } from "../../player/waiting/waiting-game-stage.ts";
import { GameStage, gameStageGADef } from "./common.ts";

export class GameStageManager {
  public constructor(
    public playerBroadcast: PlayerBroadcast,
    public stage: GameStage
  ) {}

  public handlePlayerContextCreation(context: ServerPlayerContext) {
    const { resolver } = context;
    const dispatcher = resolver.resolve(provideGADispatcher);
    dispatcher.send(gameStageGADef, { stage: this.stage.kind });
    this.stage.handlePlayerContextCreation(context);
  }

  public handlePlayerContextDeletion(context: ServerPlayerContext) {
    this.stage.handlePlayerContextDeletion(context);
  }

  public setStage(stage: GameStage) {
    this.stage = stage;
    this.playerBroadcast.send(gameStageGADef, { stage: this.stage.kind });
    this.stage.run();
  }
}

export function provideGameStageManager(resolver: ServiceResolver) {
  return new GameStageManager(
    resolver.resolve(providePlayerBroadcast),
    resolver.resolve(provideWaitingGameStage),
  );
}
