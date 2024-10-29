import { assertTrue } from "../../../core/asserts.ts";
import { GAHandler } from "../../../core/communication/define.ts";
import { Context } from "@acme/dependency/service-resolver.ts";
import { Player, providePlayer } from "../../player/player.layout.ts";
import { providePlayingGameStage } from "../../playing/playing-game-stage.ts";
import { provideServerGameContext, ServerGameContext } from "../server/context.ts";
import { GameStageManager } from "../stage/game-stage-manager.ts";
import { provideGameStageManager } from "../stage/game-stage-manager.ts";
import { StartGameGA } from "./common.ts";

export class StartGameGAHandler implements GAHandler<StartGameGA> {
  public constructor(
    private readonly gameStageManager: GameStageManager,
    private readonly player: Player,
    private readonly serverGameContext: ServerGameContext,
  ) {}

  public async handle(): Promise<void> {
    assertTrue(this.player.isAdmin, "player-must-be-admin-to-start-game");
    const { resolver } = this.serverGameContext;
    const playingGameStage = context.resolve(playingGameStageDependency);
    this.gameStageManager.setStage(playingGameStage);
  }
}

export function provideStartGameGAHandler(context: Context) {
  return new StartGameGAHandler(
    context.resolve(gameStageManagerDependency),
    context.resolve(playerDependency),
    context.resolve(serverGameContextDependency),
  );
}
