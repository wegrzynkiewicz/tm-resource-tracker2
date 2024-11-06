import { Panic } from "@acme/useful/errors.ts";
import { clientGameContextManagerDependency } from "../game/client-game-context.ts";
import { waitingViewDependency } from "./waiting-view.ts";
import { Context } from "@acme/dependency/context.ts";
import { duplexScopeToken, globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeToken, controllerScopeToken, frontendScopeToken } from "../defs.ts";
import { clientPlayerWSContextManagerDependency } from "../game/client-player-ws-context.ts";
import { Controller } from "../controller.ts";

export async function initWaitingController(context: Context): Promise<Controller> {
  const gameManager = context.resolve(clientGameContextManagerDependency);

  const gameContext = await gameManager.getClientGameContext();
  if (!gameContext) {
    throw new Panic("game-context-missing");
  }
  const clientPlayerWSContextManager = gameContext.resolve(clientPlayerWSContextManagerDependency);
  const { clientPlayerWSContext } = clientPlayerWSContextManager;
  if (clientPlayerWSContext === null) {
    throw new Panic("player-ws-context-missing");
  }

  const waitingContext = new Context({
    [globalScopeToken]: context.scopes[globalScopeToken],
    [frontendScopeToken]: context.scopes[frontendScopeToken],
    [clientGameScopeToken]: gameContext.scopes[clientGameScopeToken],
    [duplexScopeToken]: clientPlayerWSContext.scopes[duplexScopeToken],
    [controllerScopeToken]: new Scope(),
  });
  const view = waitingContext.resolve(waitingViewDependency);

  view.render();

  const dispose = () => {
    view.dispose();
  };

  return { dispose };
}
