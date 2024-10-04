import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
import { GameStage } from "@common/game/defs.ts";
import { controllerRunnerDependency } from "../../controller.ts";
import { playingPathFactory, waitingPath } from "../../frontend/routes.ts";
import { playingViewStoreDependency } from "../../frontend/playing/defs.ts";

export function provideGameStageS2CNotNormalCAHandler(resolver: DependencyResolver): NormalCAHandler {
  const controllerRunner = resolver.resolve(controllerRunnerDependency);
  const playingViewStore = resolver.resolve(playingViewStoreDependency);

  const run = (path: string) => {
    if (path === controllerRunner.currentPathname) {
      return;
    }
    controllerRunner.run(path);
  };

  const handle = async (envelope: NormalCAEnvelopeDTO) => {
    const stage = envelope.data as GameStage;
    if (stage === "PLAYING") {
      return run(playingPathFactory(playingViewStore.view));
    }
    if (stage === "WAITING") {
      return run(waitingPath);
    }
  };

  return { handle };
}

export const gameStageS2CNotNormalCAHandlerDependency = defineDependency({
  name: "game-sync-s2c-not-normal-ca-handler",
  provider: provideGameStageS2CNotNormalCAHandler,
  scope: caScopeContract,
});
