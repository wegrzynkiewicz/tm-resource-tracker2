import { ServiceResolver } from "../../../common/dependency.ts";
import { GAHandler } from "../../../common/communication/define.ts";
import { GameStageGA } from "./common.ts";
import { WaitingViewRenderer, provideWaitingViewRenderer } from "../../player/waiting/waiting-view-renderer.ts";

export class GameStageGAHandler implements GAHandler<GameStageGA>{
  public constructor(
    private readonly waitingRenderer: WaitingViewRenderer,
  ) { }

  public async handle(action: GameStageGA): Promise<void> {
    switch (action.stage) {
      case 'waiting':
        return this.waitingRenderer.render();
      case 'playing':
        return this.waitingRenderer.render();
    }
  }
}

export function provideGameStageGAHandler(resolver: ServiceResolver) {
  return new GameStageGAHandler(
    resolver.resolve(provideWaitingViewRenderer),
  );
}
