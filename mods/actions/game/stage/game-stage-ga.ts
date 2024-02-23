import { ServiceResolver } from "../../../common/dependency.ts";
import { GAHandler } from "../../../common/communication/define.ts";
import { GameStageGA } from "./common.ts";
import { LoadingView, provideLoadingView } from "../../page/loading/loading-view.ts";
import { WaitingView, provideWaitingView } from "../../player/waiting/waiting-view.ts";

export class GameStageGAHandler implements GAHandler<GameStageGA>{
  public constructor(
    private readonly waiting: WaitingView,
    private readonly loading: LoadingView,
  ) { }

  public async handle(action: GameStageGA): Promise<void> {
    switch (action.stage) {
      case 'waiting':
        return this.waiting.render();
      case 'playing':
        return this.loading.render();
    }
  }
}

export function provideGameStageGAHandler(resolver: ServiceResolver) {
  return new GameStageGAHandler(
    resolver.resolve(provideWaitingView),
    resolver.resolve(provideLoadingView),
  );
}
