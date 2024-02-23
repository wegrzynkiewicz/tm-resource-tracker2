import { assertTrue } from "../../../common/asserts.ts";
import { GAHandler } from "../../../common/communication/define.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { Player, providePlayer } from "../../player/common.ts";
import { GameStageManager, provideGameStageManager } from "../stage/game-stage-manager.ts";
import { StartGameGA } from "./common.ts";

export class StartGameGAHandler implements GAHandler<StartGameGA>{
  public constructor(
    private readonly player: Player,
    private readonly gameStageManager: GameStageManager,
  ) { }

  public async handle(): Promise<void> {
    assertTrue(this.player.isAdmin, "player-must-be-admin-to-start-game");
    this.gameStageManager.setStage("playing");
  }
}

export function provideStartGameGAHandler(resolver: ServiceResolver) {
  return new StartGameGAHandler(
    resolver.resolve(providePlayer),
    resolver.resolve(provideGameStageManager),
  );
}
