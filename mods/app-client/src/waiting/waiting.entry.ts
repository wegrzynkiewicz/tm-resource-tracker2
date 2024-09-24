import { actionBinderDependency } from "../actions.ts";
import { gameCreateActionContract, gameCreateActionHandlerDependency } from "../home/game-create-action.ts";
import { clientGameManagerDependency } from "../game/game-manager.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { waitingViewDependency } from "./waiting-view.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { homePath } from "../home/home-defs.ts";

export async function initWaitingController(parentResolver: DependencyResolver) {
  const actionBinder = parentResolver.resolve(actionBinderDependency);
  actionBinder.bind(gameCreateActionContract, gameCreateActionHandlerDependency);

  const controllerRunner = parentResolver.resolve(controllerRunnerDependency);
  const gameManager = parentResolver.resolve(clientGameManagerDependency);

  const game = await gameManager.restoreClientGame();
  if (!game) {
    return await controllerRunner.run(homePath);
  }

  const resolver = new DependencyResolver([...parentResolver.scopes, game.scope]);

  const view = resolver.resolve(waitingViewDependency);
  view.render();
}
