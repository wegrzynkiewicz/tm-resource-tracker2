import { Context } from "../../common/context.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideServerGameContext, ServerGameContext } from "../game/game.ts";
import { provideLogger } from "../../logger/global.ts";
import { LoggerFactory } from "../../logger/logger-factory.ts";
import { provideLoggerFactory } from "../../logger/logger-factory.ts";
import { providePlayerData } from "../../player/data.ts";
import { provideServerPlayerDataManager, ServerPlayerDataManager } from "./data.ts";
import { assertObject } from "../../common/asserts.ts";
import { provideWebSocket, provideWebSocketChannel } from "../../communication/socket.ts";
import { provideGADecoder } from "../../communication/decoder.ts";
import { provideReceivingGABus } from "../../communication/define.ts";
import { provideGAProcessor } from "../../communication/processor.ts";
import { feedServerGAProcessor } from "./processor.ts";
import { withResolvers } from "../../common/useful.ts";
import { Channel } from "../../common/channel.ts";

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
    private readonly playerDataManager: ServerPlayerDataManager,
    private readonly serverGameContext: ServerGameContext,
  ) { }

  public async createServerPlayerContext(
    { playerId, socket }: {
      playerId: number;
      socket: WebSocket;
    }
  ): Promise<ServerPlayerContext> {
    const player = this.playerDataManager.players.get(playerId);
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
    resolver.inject(providePlayerData, player);
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

    const { promise, resolve } = withResolvers<null>();

    webSocketChannel.opens.on(() => {
      resolve(null);
    });
    webSocketChannel.closes.on(() => {
      this.deletePlayerContext(playerId);
    });
    await promise;

    this.creates.emit(serverPlayerContext);

    this.players.set(playerId, serverPlayerContext);
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
    resolver.resolve(provideServerPlayerDataManager),
    resolver.resolve(provideServerGameContext),
  );
}
