import { actionBinderDependency } from "../actions.ts";
import { gameCreateActionContract, gameCreateActionHandlerDependency } from "./game-create-action.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { clientGameManagerDependency } from "../game/game-manager.ts";
import { homepageViewDependency } from "./home-view.ts";

export async function initHomeController(resolver: DependencyResolver) {
  const actionBinder = resolver.resolve(actionBinderDependency);
  actionBinder.bind(gameCreateActionContract, gameCreateActionHandlerDependency);

  const homepageView = resolver.resolve(homepageViewDependency);
  homepageView.render();

  const gameManager = resolver.resolve(clientGameManagerDependency);
  const game = await gameManager.restoreClientGame();
  if (game) {
    homepageView.attachResumeGame();
  }
}
