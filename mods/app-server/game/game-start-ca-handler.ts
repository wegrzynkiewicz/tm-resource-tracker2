import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
import { gameStageManagerDependency } from "./stages/game-stage-manager.ts";
import { playingGameStageDependency } from "./stages/playing-game-stage.ts";

export function provideGameStartC2SNotNormalCAHandler(resolver: DependencyResolver): NormalCAHandler {
  const playingGameStage = resolver.resolve(playingGameStageDependency);
  const gameStageManager = resolver.resolve(gameStageManagerDependency);
  const handle = async () => {
    gameStageManager.setStage(playingGameStage);
  };
  return { handle };
}

export const gameStartC2SNotNormalCAHandlerDependency = defineDependency({
  provider: provideGameStartC2SNotNormalCAHandler,
  scope: caScopeContract,
});
