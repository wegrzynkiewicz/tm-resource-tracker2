import { parsePlayingView } from "./playing-view.layout.compiled.ts";
import { Context } from "@acme/dependency/context.ts";
import { clientGameContextManagerDependency } from "../game/client-game-context.ts";
import { duplexScopeToken, globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeContract, controllerScopeContract, frontendScopeContract } from "../defs.ts";
import { Controller } from "../controller.ts";
import { clientPlayerWSContextManagerDependency } from "../game/client-player-ws-context.ts";
import { resourcesViewDependency } from "./resources/resource-view.ts";
import { Data } from "@acme/useful/types.ts";
import { gameStoreDependency } from "../game/game-store.ts";
import { loadingViewDependency } from "../loading-view.ts";
import { playingViewStoreDependency } from "./defs.ts";
import { Panic } from "@acme/useful/errors.ts";

const views = {
  resources: resourcesViewDependency,
  projects: resourcesViewDependency,
  histories: resourcesViewDependency,
  settings: resourcesViewDependency,
};

export async function initPlayingController(context: Context, params: Data): Promise<Controller> {
  const gameManager = context.resolve(clientGameContextManagerDependency);

  const [result, view] = parsePlayingView(params.view);
  if (!result) {
    throw new Panic("invalid-view", { params, view });
  }

  const gameContext = await gameManager.getClientGameContext();
  if (!gameContext) {
    throw new Panic("game-context-missing");
  }

  const clientPlayerWSContextManager = gameContext.resolve(clientPlayerWSContextManagerDependency);
  const { clientPlayerWSContext } = clientPlayerWSContextManager;
  if (!clientPlayerWSContext) {
    throw new Panic("player-ws-context-missing");
  }

  const playingContext = new Context({
    [globalScopeToken.token]: context.scopes[globalScopeToken.token],
    [frontendScopeContract.token]: context.scopes[frontendScopeContract.token],
    [clientGameScopeContract.token]: gameContext.scopes[clientGameScopeContract.token],
    [duplexScopeToken.token]: clientPlayerWSContext.scopes[duplexScopeToken.token],
    [controllerScopeContract.token]: new Scope(controllerScopeContract),
  });

  const loading = playingContext.resolve(loadingViewDependency);
  loading.render();

  const playingViewStore = playingContext.resolve(playingViewStoreDependency);
  playingViewStore.set(view);

  const gameStore = gameContext.resolve(gameStoreDependency);
  await gameStore.ready;

  const viewComponent = playingContext.resolve(resourcesViewDependency);

  viewComponent.render();

  const dispose = () => {
    viewComponent.dispose();
  };

  return { dispose };
}
