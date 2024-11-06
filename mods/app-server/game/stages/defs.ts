import { createInjectableProvider, defineDependency } from "@acme/dependency/declaration.ts";
import { serverGameScopeContract } from "../../defs.ts";

export interface GameStage {
  readonly name: string;
  acquire(): void;
  dispose(): void;
}

export const startupGameStageDependency = defineDependency<GameStage>({
  provider: createInjectableProvider("startup-game-stage"),
  scopeToken: serverGameScopeContract,
});
