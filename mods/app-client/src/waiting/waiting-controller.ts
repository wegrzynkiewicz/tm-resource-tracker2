import { defineDependency } from "@acme/dependency/declaration.ts";
import { ControllerHandler, ControllerRunner, controllerRunnerDependency } from "../controller.ts";
import { WaitingView, waitingViewDependency } from "./waiting-view.ts";
import { ClientGameManager, clientGameManagerDependency } from "../game/game-manager.ts";
import { Logger, WARN, loggerDependency } from "@acme/logger/defs.ts";
import { homeControllerContract } from "../home/common.ts";

export class WaitingControllerHandler implements ControllerHandler {
  public constructor(
    private readonly gameManager: ClientGameManager,
    private readonly controllerRunner: ControllerRunner,
    private readonly logger: Logger,
    private readonly view: WaitingView,
  ) {}

  public async handle(): Promise<void> {
    try {
      const game = await this.gameManager.restoreClientGame();
    } catch (error) {
      this.logger.log(WARN, "failed-to-restore-game", { error });
      await this.controllerRunner.run(homeControllerContract, {});
      return;
    }
    this.view.render();
  }
}

function provideWaitingControllerHandler(resolver: DependencyResolver) {
  return new WaitingControllerHandler(
    resolver.resolve(clientGameManagerDependency),
    resolver.resolve(controllerRunnerDependency),
    resolver.resolve(loggerDependency),
    resolver.resolve(waitingViewDependency),
  );
}

export const waitingControllerHandlerDependency = defineDependency({
  name: "waiting-controller-handler",
  provider: provideWaitingControllerHandler,
});
