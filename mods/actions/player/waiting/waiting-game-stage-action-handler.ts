import { ServiceResolver } from "../../../common/dependency.ts";
import { GAHandler } from "../../../common/communication/define.ts";
import { WaitingGameStageGA } from "./common.ts";
import { ClientGameContext, provideClientGameContext } from "../../game/client/context.ts";
import { provideWaitingView } from "./waiting-view.ts";

export class WaitingGameStageGAHandler implements GAHandler<WaitingGameStageGA>{
  public constructor(
    private readonly context: ClientGameContext,
  ) { }

  public async handle(): Promise<void> {
    const waiting = this.context.resolver.resolve(provideWaitingView);
    waiting.render();
  }
}

export function provideWaitingGameStageGAHandler(resolver: ServiceResolver) {
  return new WaitingGameStageGAHandler(
    resolver.resolve(provideClientGameContext),
  );
}
