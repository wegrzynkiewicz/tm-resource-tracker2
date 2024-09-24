import { defineScope, globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { cryptoRandomString } from "../deps.ts";
import { DEBUG, loggerDependency } from "@acme/logger/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";

export interface GameContext {
  gameId: string;
  scope: Scope;
  resolver: DependencyResolver;
}

export const serverGameScopeContract = defineScope("SRV-GAME");
export const serverGameIdDependency = defineDependency<string>({
  name: "game-id",
  scope: serverGameScopeContract,
});

export class ServerGameContextManager {
  public readonly games = new Map<string, GameContext>();

  public constructor(
    private readonly resolver: DependencyResolver,
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

  public createServerGame(): GameContext {
    const gameId = this.generateGameId();

    const scope = new Scope(serverGameScopeContract);
    const resolver = new DependencyResolver([...this.resolver.scopes, scope]);
    const ctx: GameContext = { gameId, resolver, scope };

    resolver.inject(serverGameIdDependency, gameId);

    const loggerFactory = resolver.resolve(loggerFactoryDependency);
    const logger = loggerFactory.createLogger("GAME", { gameId });
    resolver.inject(loggerDependency, logger);

    logger.log(DEBUG, "created-game", { gameId });

    // const gameStageManager = resolver.resolve(gameStageManagerDependency);
    // {
    //   const serverPlayerContextManager = resolver.resolve(serverPlayerContextManagerDependency);
    //   serverPlayerContextManager.creates.on((ctx) => gameStageManager.handlePlayerContextCreation(ctx));
    //   serverPlayerContextManager.deletes.on((ctx) => gameStageManager.handlePlayerContextDeletion(ctx));
    // }

    this.games.set(gameId, ctx);
    return ctx;
  }
}

function provideServerGameManager(resolver: DependencyResolver) {
  return new ServerGameContextManager(
    resolver,
  );
}

export const serverGameManagerDependency = defineDependency({
  name: "server-game-manager",
  provider: provideServerGameManager,
  scope: globalScopeContract,
});
