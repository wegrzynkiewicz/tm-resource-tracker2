import { globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
import { Controller } from "../controller.ts";
import { controllerScopeToken, frontendScopeToken } from "../defs.ts";
import { clientGameContextManagerDependency } from "../game/client-game-context.ts";
import { homepageViewDependency } from "./home-view.ts";
import { Context } from "@acme/dependency/context.ts";

export async function initHomeController(context: Context): Promise<Controller> {
  const homepageContext = new Context({
    [globalScopeToken.token]: context.scopes[globalScopeToken.token],
    [frontendScopeToken.token]: context.scopes[frontendScopeToken.token],
    [controllerScopeToken.token]: new Scope(),
  });

  const homepageView = homepageContext.resolve(homepageViewDependency);
  const gameManager = homepageContext.resolve(clientGameContextManagerDependency);

  homepageView.render();
  const game = await gameManager.getClientGameContext();
  if (game) {
    homepageView.attachResumeGame();
  }

  const dispose = () => {};

  return { dispose };
}
