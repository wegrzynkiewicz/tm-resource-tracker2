import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { Context } from "@acme/dependency/context.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
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
  scope: caScopeContract,
});
