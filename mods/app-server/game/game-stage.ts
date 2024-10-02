import { defineDependency } from "@acme/dependency/declaration.ts";
import { serverGameScopeContract } from "../defs.ts";

export class GameStage {
  public stage: string = "waiting";
}

export function provideGameStage(): GameStage {
  return new GameStage();
}

export const gameStageDependency = defineDependency({
  name: "game-stage",
  provider: provideGameStage,
  scope: serverGameScopeContract,
});
