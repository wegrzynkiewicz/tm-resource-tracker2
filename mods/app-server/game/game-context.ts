import { globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
import { DEBUG } from "@acme/logger/defs.ts";
import { createInjectableProvider, defineDependency } from "@acme/dependency/declaration.ts";
import { Context } from "@acme/dependency/context.ts";
import { serverGameScopeToken } from "../defs.ts";
import { createRandomStringFactory } from "@acme/useful/strings.ts";
import { gameStageManagerDependency } from "./stages/game-stage-manager.ts";
import { waitingGameStageDependency } from "./stages/waiting-game-stage.ts";
import { startupGameStageDependency } from "./stages/defs.ts";
import { serverGameLoggerDependency } from "./game-logger.ts";

export const serverGameIdDependency = defineDependency<string>({
  provider: createInjectableProvider("server-game-id"),
  scopeToken: serverGameScopeToken,
});

const randomGameId = createRandomStringFactory(1);

export class ServerGameContextManager {
  public readonly games = new Map<string, Context>();

  public constructor(
    private readonly globalContext: Context,
  ) {}

  private generateGameId(): string {
    while (true) {
      const gameId = randomGameId();
      if (this.games.has(gameId)) {
        continue;
      }
      return gameId;
    }
  }

  public createServerGameContext(): Context {
    const gameId = this.generateGameId();

    const gameContext = new Context({
      [globalScopeToken]: this.globalContext.scopes[globalScopeToken],
      [serverGameScopeToken]: new Scope(),
    });

    gameContext.inject(serverGameIdDependency, gameId);

    const gameStage = gameContext.resolve(waitingGameStageDependency);
    gameContext.inject(startupGameStageDependency, gameStage);

    gameContext.resolve(gameStageManagerDependency);

    const logger = gameContext.resolve(serverGameLoggerDependency);
    logger.log(DEBUG, "game-created");

    this.games.set(gameId, gameContext);
    return gameContext;
  }
}

function provideServerGameManager(context: Context) {
  return new ServerGameContextManager(
    context,
  );
}

export const serverGameManagerDependency = defineDependency({
  provider: provideServerGameManager,
  scopeToken: globalScopeToken,
});
