import { ClientConfig, clientConfigDependency } from "../../../app-client/src/config.ts";
import { Breaker } from "../../../core/asserts.ts";
import { webSocketChannelDependency, webSocketDependency } from "../../../core/communication/socket.ts";
import { Context } from "../../../core/context.ts";
import { defineDependency, DependencyResolver, Scope, scopeDependency } from "@acme/dependency/injection.ts";
import { LoggerFactory, loggerFactoryDependency } from "@acme/logger/factory.ts";
import { Game } from "../create/common.ts";
import { feedClientGAProcessor } from "./procesor.ts";
import { frontendScopeContract } from "../../../app-client/bootstrap.ts";

export interface ClientGameContextIdentifier {
  gameId: string;
  playerId: number;
}

export type ClientGameContext = Context<ClientGameContextIdentifier>;

export function provideClientGameContext(): ClientGameContext {
  throw new Breaker("client-game-context-must-be-injected");
}
export const clientGameContextDependency = defineDependency({
  kind: "client-game-context",
  provider: provideClientGameContext,
  scope: frontendScopeContract,
});

export class ClientGameContextManager {
  public context: Scope | null = null;

  public constructor(
    private scope: Scope,
    private loggerFactory: LoggerFactory,
  ) {}

  public createClientGameContext(input: Game): ClientGameContext {
    const { gameId, player, token } = input;
    const { playerId } = player;
    const resolver = new DependencyResolver();
    const context: ClientGameContext = {
      descriptor: `/client-game/${gameId}/player/${playerId}`,
      identifier: { gameId, playerId },
      resolver,
    };

    const url = new URL(this.config.wsURL);
    url.pathname = `/games/socket/${token}`;
    url.searchParams.set("time", Date.now().toString());
    const socket = new WebSocket(url.toString());

    const logger = this.loggerFactory.createLogger("CLIENT", { gameId, playerId });

    resolver.inject(clientGameContextDependency, context);
    resolver.inject(webSocketDependency, socket);
    resolver.inject(playerDependency, player);

    const webSocketChannel = resolver.resolve(webSocketChannelDependency);
    {
      const gaDecoder = resolver.resolve(gADecoderDependency);
      webSocketChannel.messages.handlers.add(gaDecoder);
    }

    const receivingGABus = resolver.resolve(receivingGABusDependency);
    {
      const gaProcessor = resolver.resolve(gAProcessorDependency);
      feedClientGAProcessor(resolver, gaProcessor);
      receivingGABus.handlers.add(gaProcessor);
    }

    this.context = context;

    return context;
  }

  public deleteClientGameContext() {
    if (this.context === null) {
      return;
    }
    const { resolver } = this.context;
    const socket = resolver.resolve(webSocketDependency);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    this.context = null;
  }
}

export function provideClientGameContextManager(resolver: DependencyResolver) {
  return new ClientGameContextManager(
    resolver.resolve(clientConfigDependency),
    resolver.resolve(scopeDependency),
    resolver.resolve(loggerFactoryDependency),
  );
}
export const clientGameContextManagerDependency = defineDependency({
  kind: "client-game-context-manager",
  provider: provideClientGameContextManager,
  scope: frontendScopeContract,
});
