import { assertTrue } from "../../../core/asserts.ts";
import { GAHandler } from "../../../core/communication/define.ts";
import { ServiceResolver } from "../../../core/dependency.ts";
import { Player, providePlayer } from "../../player/common.ts";
import { providePlayingGameStage } from "../../playing/playing-game-stage.ts";
import { ServerGameContext, provideServerGameContext } from "../server/context.ts";
import { GameStageManager } from "../stage/game-stage-manager.ts";
import { provideGameStageManager } from "../stage/game-stage-manager.ts";
import { StartGameGA } from "./common.ts";

export class StartGameGAHandler implements GAHandler<StartGameGA>{
  public constructor(
    private readonly gameStageManager: GameStageManager,
    private readonly player: Player,
    private readonly serverGameContext: ServerGameContext,
  ) { }

  public async handle(): Promise<void> {
    assertTrue(this.player.isAdmin, "player-must-be-admin-to-start-game");
    const { resolver } = this.serverGameContext;
    const playingGameStage = resolver.resolve(providePlayingGameStage);
    this.gameStageManager.setStage(playingGameStage)
  }
}

export function provideStartGameGAHandler(resolver: ServiceResolver) {
  return new StartGameGAHandler(
    resolver.resolve(provideGameStageManager),
    resolver.resolve(providePlayer),
    resolver.resolve(provideServerGameContext),
  );
}
