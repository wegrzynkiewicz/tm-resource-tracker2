import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { clientGameManagerDependency } from "../game/game-context.ts";
import { homepageViewDependency } from "./home-view.ts";

export async function initHomeController(resolver: DependencyResolver) {
  const homepageView = resolver.resolve(homepageViewDependency);
  homepageView.render();

  const gameManager = resolver.resolve(clientGameManagerDependency);
  const game = await gameManager.restoreClientGame();
  if (game) {
    homepageView.attachResumeGame();
  }
}
