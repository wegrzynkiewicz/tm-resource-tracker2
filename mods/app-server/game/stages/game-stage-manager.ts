import { defineDependency } from "@framework/dependency/declaration.ts";
import { serverGameScopeToken } from "../../defs.ts";
import { Context } from "@framework/dependency/context.ts";
import { GameStage, startupGameStageDependency } from "./defs.ts";

export class GameStageManager {
  public constructor(
    public stage: GameStage,
  ) {
    this.stage.acquire();
  }

  public setStage(stage: GameStage) {
    this.stage.dispose();
    this.stage = stage;
    this.stage.acquire();
  }
}

export function provideGameStageManager(context: Context) {
  return new GameStageManager(
    context.resolve(startupGameStageDependency),
  );
}

export const gameStageManagerDependency = defineDependency({
  provider: provideGameStageManager,
  scopeToken: serverGameScopeToken,
});
