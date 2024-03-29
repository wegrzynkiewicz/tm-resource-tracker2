import { Context } from "../../../common/context.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { provideServerGameContext, ServerGameContext } from "../../game/server/context.ts";
import { provideLogger } from "../../../common/logger/global.ts";
import { LoggerFactory } from "../../../common/logger/logger-factory.ts";
import { provideLoggerFactory } from "../../../common/logger/logger-factory.ts";
import { providePlayer } from "../common.ts";
import { assertObject } from "../../../common/asserts.ts";
import { provideWebSocket, provideWebSocketChannel } from "../../../common/communication/socket.ts";
import { provideGADecoder } from "../../../common/communication/decoder.ts";
import { provideReceivingGABus } from "../../../common/communication/define.ts";
import { provideGAProcessor } from "../../../common/communication/processor.ts";
import { feedServerGAProcessor } from "./processor.ts";
import { Channel } from "../../../common/channel.ts";
import { ServerPlayerManager, provideServerPlayerManager } from "./manager.ts";

export interface ServerPlayerContextIdentifier {
  gameId: string;
  playerId: number;
}

export type ServerPlayerContext = Context<ServerPlayerContextIdentifier>;

export function provideServerPlayerContext(): ServerPlayerContext {
  throw new Error('server-player-context-must-be-injected');
}

export class ServerPlayerContextManager {
  public readonly players = new Map<number, ServerPlayerContext>();
  public readonly creates = new Channel<ServerPlayerContext>;
  public readonly deletes = new Channel<ServerPlayerContext>;

  public constructor(
    private readonly loggerFactory: LoggerFactory,
    private readonly playerManager: ServerPlayerManager,
    private readonly serverGameContext: ServerGameContext,
  ) { }

  public async createServerPlayerContext(
    { playerId, socket }: {
      playerId: number;
      socket: WebSocket;
    }
  ): Promise<ServerPlayerContext> {
    const player = this.playerManager.players.get(playerId);
    assertObject(player, 'not-found-player-data', { status: 404 });

    const gameId = this.serverGameContext.identifier.gameId;
    const resolver = new ServiceResolver(this.serverGameContext.resolver);
    const serverPlayerContext: ServerPlayerContext = {
      descriptor: `/game/${gameId}/player/${playerId}`,
      identifier: { gameId, playerId },
      resolver,
    };
    const logger = this.loggerFactory.createLogger('PLAYER', { gameId, playerId });

    resolver.inject(provideWebSocket, socket);
    resolver.inject(provideServerPlayerContext, serverPlayerContext);
    resolver.inject(providePlayer, player);
    resolver.inject(provideLogger, logger);

    const webSocketChannel = resolver.resolve(provideWebSocketChannel);
    {
      const gaDecoder = resolver.resolve(provideGADecoder);
      webSocketChannel.messages.handlers.add(gaDecoder);
    }

    const receivingGABus = resolver.resolve(provideReceivingGABus);
    {
      const gaProcesor = resolver.resolve(provideGAProcessor);
      feedServerGAProcessor(resolver, gaProcesor);
      receivingGABus.handlers.add(gaProcesor);
    }

    webSocketChannel.closes.on(() => {
      this.deletePlayerContext(playerId);
    });
    await webSocketChannel.ready;

    this.players.set(playerId, serverPlayerContext);
    this.creates.emit(serverPlayerContext);
    
    return serverPlayerContext;
  }

  public async deletePlayerContext(playerId: number) {
    const serverPlayerContext = this.players.get(playerId);
    if (serverPlayerContext === undefined) {
      return;
    }
    const { resolver } = serverPlayerContext;
    const socket = resolver.resolve(provideWebSocket);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    this.players.delete(playerId);
    this.deletes.emit(serverPlayerContext);
  }
}

export function provideServerPlayerContextManager(resolver: ServiceResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(provideLoggerFactory),
    resolver.resolve(provideServerPlayerManager),
    resolver.resolve(provideServerGameContext),
  );
}
