import { defineScope, globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { cryptoRandomString } from "../deps.ts";
import { DEBUG, loggerDependency } from "@acme/logger/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";

export interface ServerGameContextIdentifier {
  gameId: string;
}

export type ServerGameContext = Context<ServerGameContextIdentifier>;

export const serverGameScopeContract = defineScope("SRV-GAME");

export const serverGameIdDependency = defineDependency<string>({
  name: "game-id",
  scope: serverGameScopeContract,
});

export class ServerGameContextManager {
  public readonly games = new Map<string, ServerGameContext>();

  public constructor(
    private readonly globalContext: Context,
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

    const gameContext = createContext({
      identifier: { gameId },
      name: "SRV-GAME",
      scopes: {
        [globalScopeContract.token]: this.globalContext.scopes[globalScopeContract.token],
        [serverGameScopeContract.token]: new Scope(globalScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });
    const { resolver } = gameContext;

    resolver.inject(serverGameIdDependency, gameId);

    const logger = resolver.resolve(loggerDependency);
    logger.log(DEBUG, "created-game", { gameId });

    // const gameStageManager = resolver.resolve(gameStageManagerDependency);
    // {
    //   const serverPlayerContextManager = resolver.resolve(serverPlayerContextManagerDependency);
    //   serverPlayerContextManager.creates.on((ctx) => gameStageManager.handlePlayerContextCreation(ctx));
    //   serverPlayerContextManager.deletes.on((ctx) => gameStageManager.handlePlayerContextDeletion(ctx));
    // }

    this.games.set(gameId, gameContext);
    return gameContext;
  }
}

function provideServerGameManager(resolver: DependencyResolver) {
  return new ServerGameContextManager(
    resolver.resolve(contextDependency),
  );
}

export const serverGameManagerDependency = defineDependency({
  name: "server-game-manager",
  provider: provideServerGameManager,
  scope: globalScopeContract,
});
