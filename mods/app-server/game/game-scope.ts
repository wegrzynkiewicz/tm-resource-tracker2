import { Scope, defineScope, globalScopeContract, scopeDependency } from "@acme/dependency/scopes.ts";
import { cryptoRandomString } from "../deps.ts";
import { DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";

export const gameScopeContract = defineScope("GAME", globalScopeContract);

export class ServerGameScopeManager {
  public readonly games = new Map<string, Scope>();

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

  public createServerGameScope(): Scope {
    const gameId = this.generateGameId();
    const gameScope = new Scope(gameScopeContract, { gameId }, this.parentScope);

    // const gameStageManager = resolver.resolve(gameStageManagerDependency);
    // {
    //   const serverPlayerContextManager = resolver.resolve(serverPlayerContextManagerDependency);
    //   serverPlayerContextManager.creates.on((ctx) => gameStageManager.handlePlayerContextCreation(ctx));
    //   serverPlayerContextManager.deletes.on((ctx) => gameStageManager.handlePlayerContextDeletion(ctx));
    // }

    this.games.set(gameId, gameScope);
    return gameScope;
  }
}

export function provideServerGameScopeManager(resolver: DependencyResolver) {
  return new ServerGameScopeManager(
    resolver.resolve(scopeDependency),
  );
}
export const serverGameScopeManagerDependency = defineDependency({
  kind: "server-game-scope-manager",
  provider: provideServerGameScopeManager,
  scope: globalScopeContract,
});
