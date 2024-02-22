import { feedClientGAProcessor } from "./procesor.ts";
import { Breaker } from "../../../common/asserts.ts";
import { Context } from "../../../common/context.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GlobalContext, provideGlobalContext } from "../../../common/global.ts";
import { provideGADecoder } from "../../../common/communication/decoder.ts";
import { provideReceivingGABus } from "../../../common/communication/define.ts";
import { provideGAProcessor } from "../../../common/communication/processor.ts";
import { provideWebSocket, provideWebSocketChannel } from "../../../common/communication/socket.ts";
import { provideLogger } from "../../../common/logger/global.ts";
import { LoggerFactory, provideLoggerFactory } from "../../../common/logger/logger-factory.ts";
import { Player, providePlayer } from "../../player/common.ts";
import { ClientConfig, provideClientConfig } from "../../../apps/client/features/config.ts";
import { GameResponse } from "../game.ts";

export interface ClientGameContextIdentifier {
  gameId: string;
  playerId: number;
}

export type ClientGameContext = Context<ClientGameContextIdentifier>;

export function provideClientGameContext(): ClientGameContext {
  throw new Breaker('client-game-context-must-be-injected');
}

export class ClientGameContextManager {

  public context: ClientGameContext | null = null;

  public constructor(
    private config: ClientConfig,
    private globalContext: GlobalContext,
    private loggerFactory: LoggerFactory,
  ) { }

  public createClientGameContext(input: GameResponse): ClientGameContext {
    const { gameId, player, token } = input;
    const { playerId } = player;
    const resolver = new ServiceResolver(this.globalContext.resolver);
    const context: ClientGameContext = {
      descriptor: `/client-game/${gameId}/player/${playerId}`,
      identifier: { gameId, playerId },
      resolver,
    }

    const url = new URL(this.config.wsURL);
    url.pathname = `/games/socket/${token}`;
    url.searchParams.set('time', Date.now().toString());
    const socket = new WebSocket(url.toString());

    const logger = this.loggerFactory.createLogger('CLIENT', { gameId, playerId });

    resolver.inject(provideClientGameContext, context);
    resolver.inject(provideLogger, logger);
    resolver.inject(provideWebSocket, socket);
    resolver.inject(providePlayer, player);

    const webSocketChannel = resolver.resolve(provideWebSocketChannel);
    {
      const gaDecoder = resolver.resolve(provideGADecoder);
      webSocketChannel.messages.handlers.add(gaDecoder);
    }

    const receivingGABus = resolver.resolve(provideReceivingGABus);
    {
      const gaProcessor = resolver.resolve(provideGAProcessor);
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
    const socket = resolver.resolve(provideWebSocket);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    this.context = null;
  }
}

export function provideClientGameContextManager(resolver: ServiceResolver) {
  return new ClientGameContextManager(
    resolver.resolve(provideClientConfig),
    resolver.resolve(provideGlobalContext),
    resolver.resolve(provideLoggerFactory),
  );
}
