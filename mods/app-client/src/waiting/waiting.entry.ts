import { actionBinderDependency } from "../actions.ts";
import { gameCreateActionContract, gameCreateActionHandlerDependency } from "../home/game-create-action.ts";
import { clientGameDependency, clientGameManagerDependency } from "../game/game-manager.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { homeControllerContract } from "../home/common.ts";
import { waitingViewDependency } from "./waiting-view.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export async function initWaitingController(resolver: DependencyResolver) {
  const actionBinder = resolver.resolve(actionBinderDependency);
  actionBinder.bind(gameCreateActionContract, gameCreateActionHandlerDependency);

  const controllerRunner = resolver.resolve(controllerRunnerDependency);
  const gameManager = resolver.resolve(clientGameManagerDependency);
  try {
    const game = await gameManager.restoreClientGame();
    resolver.inject(clientGameDependency, game);
  } catch {
    return await controllerRunner.run(homeControllerContract, {});
  }

  const view = resolver.resolve(waitingViewDependency);
  view.render();
}
