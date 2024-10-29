import { parsePlayingView } from "./playing-view.layout.compiled.ts";
import { Context } from "@acme/dependency/context.ts";
import { clientGameContextManagerDependency } from "../../logic/game/client-game-context.ts";
import { duplexScopeContract, globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeContract, controllerScopeContract, frontendScopeContract } from "../../../defs.ts";
import { controllerAbortDependency, controllerRunnerDependency } from "../../controller.ts";
import { clientPlayerWSContextManagerDependency } from "../../logic/game/client-player-ws-context.ts";
import { homePath } from "../routes.ts";
import { resourcesViewDependency } from "./resources/resource-view.ts";
import { Data } from "@acme/useful/types.ts";
import { gameStoreDependency } from "../../logic/game/game-store.ts";
import { loadingViewDependency } from "../../loading-view.ts";
import { playingViewStoreDependency } from "./defs.ts";

const views = {
  resources: resourcesViewDependency,
  projects: resourcesViewDependency,
  histories: resourcesViewDependency,
  settings: resourcesViewDependency,
};

export async function initPlayingController(context: Context, params: Data) {
  const controllerRunner = context.resolve(controllerRunnerDependency);
  const gameManager = context.resolve(clientGameContextManagerDependency);
  const abort = context.resolve(controllerAbortDependency);

  const [result, view] = parsePlayingView(params.view);
  if (!result) {
    return await controllerRunner.run(homePath);
  }

  const gameContext = await gameManager.getClientGameContext();
  if (!gameContext) {
    return await controllerRunner.run(homePath);
  }

  const clientPlayerWSContextManager = gameContext.resolve(clientPlayerWSContextManagerDependency);
  const { clientPlayerWSContext } = clientPlayerWSContextManager;
  if (clientPlayerWSContext === null) {
    return await controllerRunner.run(homePath);
  }

  const playingContext = new Context({
    [globalScopeContract.token]: context.scopes[globalScopeContract.token],
    [frontendScopeContract.token]: context.scopes[frontendScopeContract.token],
    [clientGameScopeContract.token]: gameContext.scopes[clientGameScopeContract.token],
    [duplexScopeContract.token]: clientPlayerWSContext.scopes[duplexScopeContract.token],
    [controllerScopeContract.token]: context.scopes[controllerScopeContract.token],
  });

  const loading = playingContext.resolve(loadingViewDependency);
  loading.render();

  const playingViewStore = playingContext.resolve(playingViewStoreDependency);
  playingViewStore.set(view);

  const gameStore = gameContext.resolve(gameStoreDependency);
  await gameStore.ready;

  const viewComponent = playingContext.resolve(resourcesViewDependency);

  viewComponent.render();

  abort.on(() => {
    viewComponent.dispose();
  });
}
