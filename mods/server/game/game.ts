import { Breaker } from "../../common/asserts.ts";
import { Context } from "../../common/context.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { cryptoRandomString } from "../../deps.ts";
import { GlobalContext, provideGlobalContext } from "../../common/global.ts";

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
    resolver.inject(provideServerGameContext, serverGameContext);
    this.games.set(gameId, serverGameContext);
    return serverGameContext;
  }
}

export function provideServerGameContextManager(resolver: ServiceResolver) {
  return new ServerGameContextManager(
    resolver.resolve(provideGlobalContext),
  );
}
