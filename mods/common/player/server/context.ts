import { assertObject } from "../../../core/asserts.ts";
import { Channel } from "../../../core/channel.ts";
import { webSocketChannelDependency, webSocketDependency } from "../../../core/communication/socket.ts";
import { Context } from "../../../core/context.ts";
import { DependencyResolver } from "@acme/dependency/injection.ts";
import { ServerGameContext, serverGameContextDependency } from "../../game/server/context.ts";
import { ServerPlayerManager, serverPlayerManagerDependency } from "./manager.ts";
import { feedServerGAProcessor } from "./processor.ts";

export interface ServerPlayerContextIdentifier {
  gameId: string;
  playerId: number;
}

export type ServerPlayerContext = Context<ServerPlayerContextIdentifier>;

export function provideServerPlayerContext(): ServerPlayerContext {
  throw new Error("server-player-context-must-be-injected");
}

export class ServerPlayerContextManager {
  public readonly players = new Map<number, ServerPlayerContext>();
  public readonly creates = new Channel<ServerPlayerContext>();
  public readonly deletes = new Channel<ServerPlayerContext>();

  public constructor(
    private readonly playerManager: ServerPlayerManager,
    private readonly serverGameContext: ServerGameContext,
  ) {}

  public async createServerPlayerContext(
    { playerId, socket }: {
      playerId: number;
      socket: WebSocket;
    },
  ): Promise<ServerPlayerContext> {
    const player = this.playerManager.players.get(playerId);
    assertObject(player, "not-found-player-data", { status: 404 });

    const gameId = this.serverGameContext.identifier.gameId;
    const resolver = new DependencyResolver();
    const serverPlayerContext: ServerPlayerContext = {
      descriptor: `/game/${gameId}/player/${playerId}`,
      identifier: { gameId, playerId },
      resolver,
    };

    resolver.inject(webSocketDependency, socket);
    resolver.inject(serverPlayerContextDependency, serverPlayerContext);
    resolver.inject(playerDependency, player);

    const webSocketChannel = resolver.resolve(webSocketChannelDependency);
    {
      const gaDecoder = resolver.resolve(gADecoderDependency);
      webSocketChannel.messages.handlers.add(gaDecoder);
    }

    const receivingGABus = resolver.resolve(receivingGABusDependency);
    {
      const gaProcesor = resolver.resolve(gAProcessorDependency);
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
    const socket = resolver.resolve(webSocketDependency);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    this.players.delete(playerId);
    this.deletes.emit(serverPlayerContext);
  }
}

export function provideServerPlayerContextManager(resolver: DependencyResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(serverPlayerManagerDependency),
    resolver.resolve(serverGameContextDependency),
  );
}
