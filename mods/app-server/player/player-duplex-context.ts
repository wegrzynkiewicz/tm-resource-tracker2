import { normalCASenderDependency } from "@acme/control-action/normal/defs.ts";
import { webSocketNormalCASenderDependency } from "@acme/control-action/transport/ws-normal-ca-sender.ts";
import { duplexScopeContract, globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { logifyWebSocket } from "@acme/web/socket.ts";
import { serverGameScopeContract, serverPlayerScopeContract } from "../defs.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";
import { ServerPlayerContext, serverPlayerDTODependency } from "./player-context.ts";
import { webSocketCAReceiverDependency } from "@acme/control-action/transport/ws-ca-receiver.ts";
import { ServerNormalCAContextFactory } from "../base/normal-ca-context-factory.ts";
import { normalCAContextFactoryDependency, normalCARouterDependency } from "@acme/control-action/normal/defs.ts";
import { webSocketDependency } from "@acme/control-action/transport/defs.ts";
import { initServerNormalCARouter } from "../base/normal-ca-router.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { playerConnectedChannelDependency, playerDisconnectedChannelDependency } from "./defs.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";

export interface ServerPlayerDuplexContextIdentifier {
  gameId: string;
  playerId: string;
  wsId: string;
}

export type ServerPlayerDuplexContext = Context<ServerPlayerDuplexContextIdentifier>;

export let wsIdCounter = 0;

export class ServerPlayerDuplexContextManager {
  public context: ServerPlayerDuplexContext | null = null;

  public constructor(
    private readonly serverPlayerContext: ServerPlayerContext,
    private readonly playerConnected: Channel<[ServerPlayerDuplexContext, PlayerDTO]>,
    private readonly playerDisconnected: Channel<[ServerPlayerDuplexContext, PlayerDTO]>,
  ) {}

  public async createServerPlayerDuplexContext(
    { socket }: {
      socket: WebSocket;
    },
  ): Promise<ServerPlayerDuplexContext> {
    const { gameId, playerId } = this.serverPlayerContext.identifier;
    const wsId = (++wsIdCounter).toString();

    const serverPlayerDuplexContext = createContext({
      identifier: { gameId, playerId, wsId },
      name: "PLR-DUX",
      scopes: {
        [globalScopeContract.token]: this.serverPlayerContext.scopes[globalScopeContract.token],
        [serverGameScopeContract.token]: this.serverPlayerContext.scopes[serverGameScopeContract.token],
        [serverPlayerScopeContract.token]: this.serverPlayerContext.scopes[serverPlayerScopeContract.token],
        [duplexScopeContract.token]: new Scope(duplexScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });
    const { resolver } = serverPlayerDuplexContext;

    this.context = serverPlayerDuplexContext;

    resolver.inject(webSocketDependency, socket);

    const logger = resolver.resolve(loggerDependency);
    logifyWebSocket(logger, socket);

    const factory = new ServerNormalCAContextFactory(serverPlayerDuplexContext);
    resolver.inject(normalCAContextFactoryDependency, factory);

    const router = initServerNormalCARouter();
    resolver.inject(normalCARouterDependency, router);

    const sender = resolver.resolve(webSocketNormalCASenderDependency);
    resolver.inject(normalCASenderDependency, sender);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });

    const receiver = resolver.resolve(webSocketCAReceiverDependency);
    socket.addEventListener("message", (event) => receiver.receive(event));

    const player = resolver.resolve(serverPlayerDTODependency);
    this.playerConnected.emit(serverPlayerDuplexContext, player);

    return serverPlayerDuplexContext;

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
    const webSocket = this.context.resolver.resolve(webSocketDependency);
    if (webSocket.readyState === WebSocket.OPEN) {
      webSocket.close();
    }
    const player = this.context.resolver.resolve(serverPlayerDTODependency);
    this.playerDisconnected.emit(this.context, player);
    this.context = null;
  }
}

export function provideServerPlayerDuplexContextManager(resolver: DependencyResolver) {
  return new ServerPlayerDuplexContextManager(
    resolver.resolve(contextDependency) as ServerPlayerContext,
    resolver.resolve(playerConnectedChannelDependency),
    resolver.resolve(playerDisconnectedChannelDependency),
  );
}

export const serverPlayerDuplexContextManagerDependency = defineDependency({
  name: "server-player-duplex-context-manager",
  provider: provideServerPlayerDuplexContextManager,
  scope: serverPlayerScopeContract,
});
