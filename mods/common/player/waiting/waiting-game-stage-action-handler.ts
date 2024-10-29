import { Context } from "@acme/dependency/service-resolver.ts";
import { GAHandler } from "../../../core/communication/define.ts";
import { WaitingGameStageGA } from "./common.ts";
import { ClientGameContext, provideClientGameContext } from "../../game/client/context.ts";
import { provideWaitingView } from "./waiting-view.ts";

export class WaitingGameStageGAHandler implements GAHandler<WaitingGameStageGA> {
  public constructor(
    private readonly context: ClientGameContext,
  ) {}

  public async handle(): Promise<void> {
    const waiting = this.context.context.resolve(waitingViewDependency);
    waiting.render();
  }
}

export function provideWaitingGameStageGAHandler(context: Context) {
  return new WaitingGameStageGAHandler(
    context.resolve(clientGameContextDependency),
  );
}
