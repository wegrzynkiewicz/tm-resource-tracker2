import { parsePlayingView, PlayingView } from "./playing-view.layout.compiled.ts";
import { Context, createContext } from "@acme/dependency/context.ts";
import { clientGameContextManagerDependency } from "../../logic/game/client-game-context.ts";
import { duplexScopeContract, globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeContract, controllerScopeContract, frontendScopeContract } from "../../../defs.ts";
import { controllerRunnerDependency } from "../../controller.ts";
import { clientPlayerWSContextManagerDependency } from "../../logic/game/client-player-ws-context.ts";
import { homePath } from "../routes.ts";
import { supplyViewDependency } from "./supplies/supply-view.ts";
import { Data } from "@acme/useful/types.ts";
import { View } from "../../common.ts";
import { Dependency } from "@acme/dependency/declaration.ts";
import { gameStoreDependency } from "../../logic/game/game-store.ts";
import { loadingViewDependency } from "../../loading-view.ts";
import { playingViewStoreDependency } from "./playing-view-store.ts";

const views: Record<PlayingView, Dependency<View>> = {
  supplies: supplyViewDependency,
  projects: supplyViewDependency,
  histories: supplyViewDependency,
  settings: supplyViewDependency,
};

export async function initPlayingController(context: Context, params: Data) {
  const controllerRunner = context.resolver.resolve(controllerRunnerDependency);
  const gameManager = context.resolver.resolve(clientGameContextManagerDependency);

  const [result, view] = parsePlayingView(params.view);
  if (!result) {
    return await controllerRunner.run(homePath);
  }

  const gameContext = await gameManager.getClientGameContext();
  if (!gameContext) {
    return await controllerRunner.run(homePath);
  }

  const clientPlayerWSContextManager = gameContext.resolver.resolve(clientPlayerWSContextManagerDependency);
  const { clientPlayerWSContext } = clientPlayerWSContextManager;
  if (clientPlayerWSContext === null) {
    return await controllerRunner.run(homePath);
  }

  const controllerContext = createContext({
    identifier: {},
    name: "PLAYING-CTRL",
    scopes: {
      [globalScopeContract.token]: context.scopes[globalScopeContract.token],
      [frontendScopeContract.token]: context.scopes[frontendScopeContract.token],
      [clientGameScopeContract.token]: gameContext.scopes[clientGameScopeContract.token],
      [duplexScopeContract.token]: clientPlayerWSContext.scopes[duplexScopeContract.token],
      [controllerScopeContract.token]: context.scopes[controllerScopeContract.token],
      [localScopeContract.token]: new Scope(localScopeContract),
    },
  });
  const { resolver } = controllerContext;

  const loading = resolver.resolve(loadingViewDependency);
  loading.render();

  const playingViewStore = resolver.resolve(playingViewStoreDependency);
  playingViewStore.update(view);

  const gameStore = gameContext.resolver.resolve(gameStoreDependency);
  await gameStore.ready;

  const viewComponent = resolver.resolve(supplyViewDependency);

  viewComponent.render();
}
