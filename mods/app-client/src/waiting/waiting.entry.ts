import { clientGameContextManagerDependency } from "../game-context/client-game-context.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { waitingViewDependency } from "./waiting-view.ts";
import { homePath } from "../home/home-defs.ts";
import { Context, createContext } from "@acme/dependency/context.ts";
import { duplexScopeContract, globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeContract, controllerScopeContract, frontendScopeContract } from "../../defs.ts";
import { clientPlayerWSContextManagerDependency } from "../game-context/client-player-ws-context.ts";

export async function initWaitingController(context: Context) {
  const controllerRunner = context.resolver.resolve(controllerRunnerDependency);
  const gameManager = context.resolver.resolve(clientGameContextManagerDependency);

  const gameContext = await gameManager.getClientGameContext();
  if (!gameContext) {
    return await controllerRunner.run(homePath);
  }
  const clientPlayerWSContextManager = gameContext.resolver.resolve(clientPlayerWSContextManagerDependency);
  const { clientPlayerWSContext } = clientPlayerWSContextManager;
  if (clientPlayerWSContext === null) {
    return await controllerRunner.run(homePath);
  }

  const waitingContext = createContext({
    identifier: {},
    name: "WAITING-CTRL",
    scopes: {
      [globalScopeContract.token]: context.scopes[globalScopeContract.token],
      [frontendScopeContract.token]: context.scopes[frontendScopeContract.token],
      [clientGameScopeContract.token]: gameContext.scopes[clientGameScopeContract.token],
      [duplexScopeContract.token]: clientPlayerWSContext.scopes[duplexScopeContract.token],
      [controllerScopeContract.token]: new Scope(controllerScopeContract),
      [localScopeContract.token]: new Scope(localScopeContract),
    },
  });
  const { resolver } = waitingContext;
  const view = resolver.resolve(waitingViewDependency);

  view.render();
}
