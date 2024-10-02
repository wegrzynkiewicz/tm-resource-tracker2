import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";

export function provideGameStartC2SNotNormalCAHandler(resolver: DependencyResolver): NormalCAHandler {
  const handle = async () => {
    console.log("Game start C2S not normal CA handler");
  };
  return { handle };
}

export const gameStartC2SNotNormalCAHandlerDependency = defineDependency({
  name: "game-start-c2s-not-normal-ca-handler",
  provider: provideGameStartC2SNotNormalCAHandler,
  scope: caScopeContract,
});
