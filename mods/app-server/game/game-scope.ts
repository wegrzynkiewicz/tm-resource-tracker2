import { Scope, defineScope, globalScopeContract, scopeDependency } from "@acme/dependency/scopes.ts";
import { cryptoRandomString } from "../deps.ts";
import { DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";
import { Game } from "./game.ts";
import { DEBUG, loggerDependency } from "@acme/logger/defs.ts";

export const gameScopeContract = defineScope("GAME", globalScopeContract);

export class ServerGameManager {
  public readonly games = new Map<string, Game>();

  public constructor(
    private parentScope: Scope,
  ) {}

  private generateGameId(): string {
    while (true) {
      const gameId = cryptoRandomString({ length: 1, type: "distinguishable" });
      if (this.games.has(gameId)) {
        continue;
      }
      return gameId;
    }
  }

  public createServerGame(): Game {
    const gameId = this.generateGameId();
    const scope = new Scope(gameScopeContract, { gameId }, this.parentScope);

    const logger = scope.resolver.resolve(loggerDependency);

    const game: Game = { gameId, scope };
    logger.log(DEBUG, "created-game", { gameId })

    // const gameStageManager = resolver.resolve(gameStageManagerDependency);
    // {
    //   const serverPlayerContextManager = resolver.resolve(serverPlayerContextManagerDependency);
    //   serverPlayerContextManager.creates.on((ctx) => gameStageManager.handlePlayerContextCreation(ctx));
    //   serverPlayerContextManager.deletes.on((ctx) => gameStageManager.handlePlayerContextDeletion(ctx));
    // }

    this.games.set(gameId, game);
    return game;
  }
}

function provideServerGameManager(resolver: DependencyResolver) {
  return new ServerGameManager(
    resolver.resolve(scopeDependency),
  );
}
export const serverGameManagerDependency = defineDependency({
  kind: "server-game-manager",
  provider: provideServerGameManager,
  scope: globalScopeContract,
});
