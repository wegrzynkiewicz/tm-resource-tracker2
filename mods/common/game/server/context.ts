import { cryptoRandomString } from "../../../app-server/deps.ts";
import { Breaker } from "../../../core/asserts.ts";
import { Context } from "../../../core/context.ts";
import { defineDependency, DependencyResolver, Scope, scopeDependency } from "@acme/dependency/injection.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { LoggerFactory, loggerFactoryDependency } from "@acme/logger/factory.ts";
import { globalScopeContract } from "@acme/dependency/scopes.ts";

export interface ServerGameContextIdentifier {
  gameId: string;
}

export type ServerGameContext = Context<ServerGameContextIdentifier>;

export function provideServerGameContext(): ServerGameContext {
  throw new Breaker("server-game-context-must-be-injected");
}
export const serverGameContextDependency = defineDependency({
  kind: "server-game-context",
  provider: provideServerGameContext,
});

export class ServerGameContextManager {
  public readonly games = new Map<string, ServerGameContext>();

  public constructor(
    private scope: Scope,
    private loggerFactory: LoggerFactory,
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

  public createServerGameContext(): ServerGameContext {
    const gameId = this.generateGameId();
    const resolver = new DependencyResolver();
    const serverGameContext: ServerGameContext = {
      descriptor: `/game/${gameId}`,
      identifier: { gameId },
      resolver,
    };

    const logger = this.loggerFactory.createLogger("GAME", { gameId });

    resolver.inject(serverGameContextDependency, serverGameContext);
    resolver.inject(loggerDependency, logger);

    const gameStageManager = resolver.resolve(gameStageManagerDependency);
    {
      const serverPlayerContextManager = resolver.resolve(serverPlayerContextManagerDependency);
      serverPlayerContextManager.creates.on((ctx) => gameStageManager.handlePlayerContextCreation(ctx));
      serverPlayerContextManager.deletes.on((ctx) => gameStageManager.handlePlayerContextDeletion(ctx));
    }

    this.games.set(gameId, serverGameContext);
    return serverGameContext;
  }
}

export function provideServerGameContextManager(resolver: DependencyResolver) {
  return new ServerGameContextManager(
    resolver.resolve(scopeDependency),
    resolver.resolve(loggerFactoryDependency),
  );
}
export const serverGameContextManagerDependency = defineDependency({
  kind: "server-game-context-manager",
  provider: provideServerGameContextManager,
  scope: globalScopeContract,
});
