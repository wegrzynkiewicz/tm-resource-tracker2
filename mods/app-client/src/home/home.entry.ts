import { clientGameContextManagerDependency } from "../game/client-game-context.ts";
import { homepageViewDependency } from "./home-view.ts";
import { Context } from "@acme/dependency/context.ts";

export async function initHomeController(context: Context) {
  const homepageView = context.resolve(homepageViewDependency);
  const gameManager = context.resolve(clientGameContextManagerDependency);

  homepageView.render();
  const game = await gameManager.getClientGameContext();
  if (game) {
    homepageView.attachResumeGame();
  }
}
