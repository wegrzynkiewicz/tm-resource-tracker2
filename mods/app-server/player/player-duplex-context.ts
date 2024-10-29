import { normalCASenderDependency } from "@acme/control-action/normal/defs.ts";
import { webSocketNormalCASenderDependency } from "@acme/control-action/transport/ws-normal-ca-sender.ts";
import { duplexScopeContract, globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { logifyWebSocket } from "@acme/web/socket.ts";
import { serverGameScopeContract, serverPlayerScopeContract } from "../defs.ts";
import { Context } from "@acme/dependency/context.ts";
import { webSocketCAReceiverDependency } from "@acme/control-action/transport/ws-ca-receiver.ts";
import { ServerNormalCAContextFactory } from "../base/normal-ca-context-factory.ts";
import { normalCAContextFactoryDependency, normalCARouterDependency } from "@acme/control-action/normal/defs.ts";
import { webSocketDependency } from "@acme/control-action/transport/defs.ts";
import { initServerNormalCARouter } from "../base/normal-ca-router.ts";
import { Channel } from "@acme/dom/channel.ts";
import { duplexIdDependency, playerConnectedChannelDependency, playerDisconnectedChannelDependency } from "./defs.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { serverPlayerDTODependency } from "./player-context.ts";
import { serverPlayerDuplexLoggerDependency } from "./player-logger.ts";

let duplexId = 1;

export class ServerPlayerDuplexContextManager {
  public context: Context | null = null;

  public constructor(
    private readonly serverPlayerContext: Context,
    private readonly playerConnected: Channel<[Context, PlayerDTO]>,
    private readonly playerDisconnected: Channel<[Context, PlayerDTO]>,
  ) {}

  public async createServerPlayerDuplexContext(
    { socket }: {
      socket: WebSocket;
    },
  ): Promise<Context> {
    const context = new Context({
      [globalScopeContract.token]: this.serverPlayerContext.scopes[globalScopeContract.token],
      [serverGameScopeContract.token]: this.serverPlayerContext.scopes[serverGameScopeContract.token],
      [serverPlayerScopeContract.token]: this.serverPlayerContext.scopes[serverPlayerScopeContract.token],
      [duplexScopeContract.token]: new Scope(duplexScopeContract),
    });

    this.context = context;

    context.inject(duplexIdDependency, duplexId++);
    context.inject(webSocketDependency, socket);

    const logger = context.resolve(serverPlayerDuplexLoggerDependency);
    logifyWebSocket(logger, socket);

    const factory = new ServerNormalCAContextFactory(context);
    context.inject(normalCAContextFactoryDependency, factory);

    const router = initServerNormalCARouter();
    context.inject(normalCARouterDependency, router);

    const sender = context.resolve(webSocketNormalCASenderDependency);
    context.inject(normalCASenderDependency, sender);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });

    const receiver = context.resolve(webSocketCAReceiverDependency);
    socket.addEventListener("message", (event) => receiver.receive(event));

    const player = context.resolve(serverPlayerDTODependency);
    this.playerConnected.emit(context, player);

    return context;

    // const webSocketChannel = context.resolve(webSocketChannelDependency);
    // {
    //   const gaDecoder = context.resolve(gADecoderDependency);
    //   webSocketChannel.messages.handlers.add(gaDecoder);
    // }

    // const receivingGABus = context.resolve(receivingGABusDependency);
    // {
    //   const gaProcesor = context.resolve(gAProcessorDependency);
    //   feedServerGAProcessor(resolver, gaProcesor);
    //   receivingGABus.handlers.add(gaProcesor);
    // }
  }

  public async dispose() {
    if (this.context === null) {
      return;
    }
    const webSocket = this.context.resolve(webSocketDependency);
    if (webSocket.readyState === WebSocket.OPEN) {
      webSocket.close();
    }
    const player = this.context.resolve(serverPlayerDTODependency);
    this.playerDisconnected.emit(this.context, player);
    this.context = null;
  }
}

export function provideServerPlayerDuplexContextManager(context: Context) {
  return new ServerPlayerDuplexContextManager(
    context,
    context.resolve(playerConnectedChannelDependency),
    context.resolve(playerDisconnectedChannelDependency),
  );
}

export const serverPlayerDuplexContextManagerDependency = defineDependency({
  provider: provideServerPlayerDuplexContextManager,
  scope: serverPlayerScopeContract,
});
