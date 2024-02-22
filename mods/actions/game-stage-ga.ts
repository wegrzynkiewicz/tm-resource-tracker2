import { AppView, provideAppView } from "../apps/client/features/app/app.ts";
import { WaitingView, provideWaitingView } from "./player/waiting/view.ts";
import { ServiceResolver } from "../common/dependency.ts";
import { GADefinition, GAHandler } from "../common/communication/define.ts";

export interface GameStageGA {
  stage: string;
}

export const gameStageGADef: GADefinition<GameStageGA> = {
  kind: 'game-stage'
};

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
