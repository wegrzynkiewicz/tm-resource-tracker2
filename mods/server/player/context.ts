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
import { gameStageGADef } from "../../action/game-stage-ga.ts";
import { provideGADecoder } from "../../communication/decoder.ts";
import { provideReceivingGABus } from "../../communication/define.ts";
import { provideGADispatcher } from "../../communication/dispatcher.ts";
import { provideGAProcessor } from "../../communication/processor.ts";
import { feedServerGAProcessor } from "./processor.ts";

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

  public constructor(
    private readonly loggerFactory: LoggerFactory,
    private readonly playerDataManager: ServerPlayerDataManager,
    private readonly serverGameContext: ServerGameContext,
  ) { }

  public createServerPlayerContext(
    { playerId, socket }: {
      playerId: number;
      socket: WebSocket;
    }
  ): ServerPlayerContext {
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

    const gaDispatcher = resolver.resolve(provideGADispatcher);

    webSocketChannel.opens.on(() => {
      gaDispatcher.send(gameStageGADef, { stage: 'waiting' })
    });

    this.players.set(playerId, serverPlayerContext);
    return serverPlayerContext;
  }
}

export function provideServerPlayerContextManager(resolver: ServiceResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(provideLoggerFactory),
    resolver.resolve(provideServerPlayerDataManager),
    resolver.resolve(provideServerGameContext),
  );
}
