import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { GAHandler } from "../../../core/communication/define.ts";
import { WaitingGameStageGA } from "./common.ts";
import { ClientGameContext, provideClientGameContext } from "../../game/client/context.ts";
import { provideWaitingView } from "./waiting-view.ts";

export class WaitingGameStageGAHandler implements GAHandler<WaitingGameStageGA> {
  public constructor(
    private readonly context: ClientGameContext,
  ) {}

  public async handle(): Promise<void> {
    const waiting = this.context.resolver.resolve(waitingViewDependency);
    waiting.render();
  }
}

export function provideWaitingGameStageGAHandler(resolver: DependencyResolver) {
  return new WaitingGameStageGAHandler(
    resolver.resolve(clientGameContextDependency),
  );
}
