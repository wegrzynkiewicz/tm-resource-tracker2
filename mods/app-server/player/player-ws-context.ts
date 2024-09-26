import { Scope } from "@acme/dependency/scopes.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";
import { serverGameIdDependency } from "../game/game-context.ts";
import { logifyWebSocket } from "@acme/web/socket.ts";
import { wsScopeContract } from "../../common/web-socket/ws-context.ts";
import { serverPlayerScopeContract } from "../defs.ts";
import { serverPlayerIdDependency } from "./player-context.ts";

export interface ServerPlayerWSContext {
  gameId: string;
  playerId: string;
  netId: string;
  scope: Scope;
  resolver: DependencyResolver;
  socket: WebSocket;
}

export let netIdCounter = 0;

export class ServerPlayerWSContextManager {
  public context: ServerPlayerWSContext | null = null;

  public constructor(
    private readonly gameId: string,
    private readonly playerId: string,
    private readonly resolver: DependencyResolver,
  ) {}

  public async create(
    { socket }: {
      socket: WebSocket,
    },
  ): Promise<ServerPlayerWSContext> {
    const { gameId, playerId } = this;
    const netId = (++netIdCounter).toString();

    const scope = new Scope(wsScopeContract);
    const resolver = new DependencyResolver([...this.resolver.scopes, scope]);
    const ctx: ServerPlayerWSContext = { gameId, playerId, netId, resolver, scope, socket };

    const loggerFactory = resolver.resolve(loggerFactoryDependency);
    const logger = loggerFactory.createLogger("PLAYER-NET", { netId, gameId, playerId });
    resolver.inject(loggerDependency, logger);

    logifyWebSocket(logger, socket);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });

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

  public async dispose() {
    if (this.context === null) {
      return;
    }
    if (this.context.socket.readyState === WebSocket.OPEN) {
      this.context.socket.close();
    }
    this.context = null;
  }
}

export function provideServerPlayerWSContextManager(resolver: DependencyResolver) {
  const s = performance.now();
  resolver.resolve(serverGameIdDependency)
  const e = performance.now();
  console.log(`ServerPlayerWSContextManager: ${e - s}ms`);

  return new ServerPlayerWSContextManager(
    resolver.resolve(serverGameIdDependency),
    resolver.resolve(serverPlayerIdDependency),
    resolver,
  );
}

export const serverPlayerWSContextManagerDependency = defineDependency({
  name: "server-player-context-manager",
  provider: provideServerPlayerWSContextManager,
  scope: serverPlayerScopeContract,
});
