import { defineScope, Scope } from "@acme/dependency/scopes.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { ServerPlayerManager, serverPlayerManagerDependency } from "./player-manager.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { Panic } from "@acme/useful/errors.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";
import { PlayerDTO } from "../../common/player/player.layout.compiled.ts";
import { serverGameIdDependency, serverGameScopeContract } from "../game/game-context.ts";
import { logifyWebSocket } from "@acme/web/socket.ts";

export interface ServerPlayerContext {
  playerId: string;
  scope: Scope;
  resolver: DependencyResolver;
  socket: WebSocket;
}

export const serverPlayerScopeContract = defineScope("SRV-PLAYER");
export const serverPlayerIdDependency = defineDependency<number>({ name: "player-id" });
export const serverPlayerDependency = defineDependency<PlayerDTO>({ name: "player" });
export const serverPlayerWebSocketDependency = defineDependency<WebSocket>({ name: "player-web-socket" });

export class ServerPlayerContextManager {
  public readonly players = new Map<string, ServerPlayerContext>();
  public readonly creates = new Channel<[ServerPlayerContext]>();
  public readonly deletes = new Channel<[ServerPlayerContext]>();

  public constructor(
    private readonly gameId: string,
    private readonly playerManager: ServerPlayerManager,
    private readonly resolver: DependencyResolver,
  ) {}

  public async createServerPlayerContext(
    { playerId, socket }: {
      playerId: string;
      socket: WebSocket;
    },
  ): Promise<ServerPlayerContext> {
    const { gameId, playerManager } = this;
    const player = playerManager.players.get(playerId);
    if (player === undefined) {
      throw new Panic("not-found-player-data", { status: 500 });
    }

    const scope = new Scope(serverPlayerScopeContract);
    const resolver = new DependencyResolver([...this.resolver.scopes, scope]);
    const ctx: ServerPlayerContext = { playerId, resolver, scope, socket };

    const loggerFactory = resolver.resolve(loggerFactoryDependency);
    const logger = loggerFactory.createLogger("PLAYER", { gameId });
    resolver.inject(loggerDependency, logger);
    resolver.inject(serverPlayerWebSocketDependency, socket);
    resolver.inject(serverPlayerDependency, player);

    logifyWebSocket(logger, socket);

    socket.addEventListener("close", () => {
      this.deletePlayerContext(playerId);
    });

    this.players.set(playerId, ctx);
    this.creates.emit(ctx);

    return ctx;

    // const webSocketChannel = resolver.resolve(webSocketChannelDependency);
    // {
    //   const gaDecoder = resolver.resolve(gADecoderDependency);
    //   webSocketChannel.messages.handlers.add(gaDecoder);
    // }

    // const receivingGABus = resolver.resolve(receivingGABusDependency);
    // {
    //   const gaProcesor = resolver.resolve(gAProcessorDependency);
    //   feedServerGAProcessor(resolver, gaProcesor);
    //   receivingGABus.handlers.add(gaProcesor);
    // }
  }

  public async deletePlayerContext(playerId: string) {
    const ctx = this.players.get(playerId);
    if (ctx === undefined) {
      return;
    }
    if (ctx.socket.readyState === WebSocket.OPEN) {
      ctx.socket.close();
    }
    this.players.delete(playerId);
    this.deletes.emit(ctx);
  }
}

export function provideServerPlayerContextManager(resolver: DependencyResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(serverGameIdDependency),
    resolver.resolve(serverPlayerManagerDependency),
    resolver,
  );
}

export const serverPlayerContextManagerDependency = defineDependency({
  name: "server-player-context-manager",
  provider: provideServerPlayerContextManager,
  scope: serverGameScopeContract,
});
