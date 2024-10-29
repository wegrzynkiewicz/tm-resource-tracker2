import { clientGameContextManagerDependency } from "../../logic/game/client-game-context.ts";
import { controllerRunnerDependency } from "../../controller.ts";
import { waitingViewDependency } from "./waiting-view.ts";
import { homePath } from "../routes.ts";
import { Context } from "@acme/dependency/context.ts";
import { duplexScopeContract, globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeContract, controllerScopeContract, frontendScopeContract } from "../../../defs.ts";
import { clientPlayerWSContextManagerDependency } from "../../logic/game/client-player-ws-context.ts";

export async function initWaitingController(context: Context) {
  const controllerRunner = context.resolve(controllerRunnerDependency);
  const gameManager = context.resolve(clientGameContextManagerDependency);

  const gameContext = await gameManager.getClientGameContext();
  if (!gameContext) {
    return await controllerRunner.run(homePath);
  }
  const clientPlayerWSContextManager = gameContext.resolve(clientPlayerWSContextManagerDependency);
  const { clientPlayerWSContext } = clientPlayerWSContextManager;
  if (clientPlayerWSContext === null) {
    return await controllerRunner.run(homePath);
  }

  const waitingContext = new Context({
    [globalScopeContract.token]: context.scopes[globalScopeContract.token],
    [frontendScopeContract.token]: context.scopes[frontendScopeContract.token],
    [clientGameScopeContract.token]: gameContext.scopes[clientGameScopeContract.token],
    [duplexScopeContract.token]: clientPlayerWSContext.scopes[duplexScopeContract.token],
    [controllerScopeContract.token]: context.scopes[controllerScopeContract.token],
    [localScopeContract.token]: new Scope(localScopeContract),
  });
  const view = waitingContext.resolve(waitingViewDependency);

  view.render();
}
