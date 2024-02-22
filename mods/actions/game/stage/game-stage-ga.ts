import { AppView, provideAppView } from "../../../apps/client/features/app/app.ts";
import { WaitingView, provideWaitingView } from "../../player/waiting/view.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GAHandler } from "../../../common/communication/define.ts";
import { GameStageGA } from "./common.ts";

export class GameStageGAHandler implements GAHandler<GameStageGA>{
  public constructor(
    private readonly appView: AppView,
    private readonly waitingView: WaitingView,
  ) { }

  public async handle(action: GameStageGA): Promise<void> {
    if (action.stage === 'waiting') {
      this.appView.mount(this.waitingView.$root);
    }
  }
}

export function provideGameStageGAHandler(resolver: ServiceResolver) {
  return new GameStageGAHandler(
    resolver.resolve(provideAppView),
    resolver.resolve(provideWaitingView),
  );
}
