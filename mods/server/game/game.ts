import { Breaker } from "../../common/asserts.ts";
import { Context } from "../../common/context.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { cryptoRandomString } from "../../deps.ts";
import { GlobalContext, provideGlobalContext } from "../../common/global.ts";
import { LoggerFactory, provideLoggerFactory } from "../../logger/logger-factory.ts";
import { provideLogger } from "../../logger/global.ts";

export interface ServerGameContextIdentifier {
  gameId: string;
}

export type ServerGameContext = Context<ServerGameContextIdentifier>;

export function provideServerGameContext(): ServerGameContext {
  throw new Breaker('server-game-context-must-be-injected');
}

export class ServerGameContextManager {
  public readonly games = new Map<string, ServerGameContext>();

  public constructor(
    private globalContext: GlobalContext,
    private loggerFactory: LoggerFactory,
  ) { }

  private generateGameId(): string {
    while (true) {
      const gameId = cryptoRandomString({ length: 5, type: "distinguishable" });
      if (this.games.has(gameId)) {
        continue;
      }
      return gameId;
    }
  }

  public createServerGameContext(): ServerGameContext {
    const gameId = this.generateGameId();
    const resolver = new ServiceResolver(this.globalContext.resolver);
    const serverGameContext: ServerGameContext = {
      descriptor: `/game/${gameId}`,
      identifier: { gameId },
      resolver,
    };

    const logger = this.loggerFactory.createLogger('GAME', { gameId });

    resolver.inject(provideServerGameContext, serverGameContext);
    resolver.inject(provideLogger, logger);
    
    this.games.set(gameId, serverGameContext);
    return serverGameContext;
  }
}

export function provideServerGameContextManager(resolver: ServiceResolver) {
  return new ServerGameContextManager(
    resolver.resolve(provideGlobalContext),
    resolver.resolve(provideLoggerFactory),
  );
}
