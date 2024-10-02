import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
import { gameStageDependency } from "./game-stage.ts";
import { gameProcessorDependency } from "./game-processor.ts";

export function provideGameStartC2SNotNormalCAHandler(resolver: DependencyResolver): NormalCAHandler {
  const gameStage = resolver.resolve(gameStageDependency);
  const gameProcessor = resolver.resolve(gameProcessorDependency);
  const handle = async () => {
    gameStage.stage = "playing";
    gameProcessor.broadcast();
  };
  return { handle };
}

export const gameStartC2SNotNormalCAHandlerDependency = defineDependency({
  name: "game-start-c2s-not-normal-ca-handler",
  provider: provideGameStartC2SNotNormalCAHandler,
  scope: caScopeContract,
});
