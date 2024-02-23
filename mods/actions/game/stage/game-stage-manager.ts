import { Channel } from "../../../common/channel.ts";
import { GameStage } from "./common.ts";

export class GameStageManager {
  public stage: GameStage = 'waiting';
  public updates = new Channel<GameStage>();

  public setStage(stage: GameStage) {
    this.stage = stage;
    this.updates.emit(stage);
  }
}

export function provideGameStageManager() {
  return new GameStageManager();
}
