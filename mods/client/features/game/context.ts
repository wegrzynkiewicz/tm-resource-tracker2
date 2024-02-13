import { Breaker } from "../../../common/asserts.ts";
import { Context } from "../../../common/context.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GlobalContext, provideGlobalContext } from "../../../common/global.ts";
import { ClientConfig, provideClientConfig } from "../config.ts";
import { provideWebSocket } from "./web-socket.ts";

export interface ClientGameContextInput {
  readonly gameId: string,
  readonly isAdmin: boolean,
  readonly playerId: number,
  readonly token: string,
}

export interface ClientGameContextIdentifier {
  gameId: string;
  playerId: number;
}

export type ClientGameContext = Context<ClientGameContextIdentifier>;

export function provideClientGameContext(): ClientGameContext {
  throw new Breaker('client-game-context-must-be-injected');
}

export class ClientGameContextManager {

  public constructor(
    private config: ClientConfig,
    private globalContext: GlobalContext,
  ) { }

  public createClientGameContext(input: ClientGameContextInput): ClientGameContext {
    const { gameId, playerId, token } = input;
    const resolver = new ServiceResolver(this.globalContext.resolver);
    const context: ClientGameContext = {
      descriptor: `/client-game/${gameId}/player/${playerId}`,
      identifier: { gameId, playerId },
      resolver,
    }

    const url = new URL(this.config.wsURL);
    url.pathname = `/player-web-socket/${token}`;
    const socket = new WebSocket(url.toString());

    resolver.inject(provideClientGameContext, context);
    resolver.inject(provideWebSocket, socket);

    return context;
  }
}

export function provideClientGameContextManager(resolver: ServiceResolver) {
  return new ClientGameContextManager(
    resolver.resolve(provideClientConfig),
    resolver.resolve(provideGlobalContext),
  );
}
