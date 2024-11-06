import { NormalCAHandler } from "@framework/control-action/normal/defs.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { caScopeToken } from "@framework/dependency/scopes.ts";
import { gameStageManagerDependency } from "./stages/game-stage-manager.ts";
import { playingGameStageDependency } from "./stages/playing-game-stage.ts";

export function provideGameStartC2SNotNormalCAHandler(context: Context): NormalCAHandler {
  const playingGameStage = context.resolve(playingGameStageDependency);
  const gameStageManager = context.resolve(gameStageManagerDependency);
  const handle = async () => {
    gameStageManager.setStage(playingGameStage);
  };
  return { handle };
}

export const gameStartC2SNotNormalCAHandlerDependency = defineDependency({
  provider: provideGameStartC2SNotNormalCAHandler,
  scopeToken: caScopeToken,
});
