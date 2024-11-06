import { NormalCAHandler } from "@framework/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@framework/control-action/normal/envelope.layout.compiled.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { caScopeToken } from "@framework/dependency/scopes.ts";
import { GameStage } from "@common/game/defs.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { playingPathFactory, waitingPath } from "../routes.ts";
import { playingViewStoreDependency } from "../playing/defs.ts";

export function provideGameStageS2CNotNormalCAHandler(context: Context): NormalCAHandler {
  const controllerRunner = context.resolve(controllerRunnerDependency);
  const playingViewStore = context.resolve(playingViewStoreDependency);

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
  provider: provideGameStageS2CNotNormalCAHandler,
  scopeToken: caScopeToken,
});
