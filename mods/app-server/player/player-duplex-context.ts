import { duplexIdDependency, duplexLoggerDependency } from "@acme/control-action/defs.ts";
import { serverGameIdDependency } from "./../game/game-context.ts";
import { normalCASenderDependency } from "@acme/control-action/normal/defs.ts";
import { webSocketNormalCASenderDependency } from "@acme/control-action/transport/ws-normal-ca-sender.ts";
import { duplexScopeToken, globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
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
import { playerConnectedChannelDependency, playerDisconnectedChannelDependency } from "./defs.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { serverPlayerDTODependency, serverPlayerIdDependency } from "./player-context.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";

let duplexIdCounter = 1;

export class ServerPlayerDuplexContextManager {
  public context: Context | null = null;

  public constructor(
    private readonly serverPlayerContext: Context,
    private readonly playerConnected: Channel<[Context, PlayerDTO]>,
    private readonly playerDisconnected: Channel<[Context, PlayerDTO]>,
  ) {}

  public createServerPlayerDuplexContext(socket: WebSocket): Context {
    const context = new Context({
      [globalScopeToken.token]: this.serverPlayerContext.scopes[globalScopeToken.token],
      [serverGameScopeContract.token]: this.serverPlayerContext.scopes[serverGameScopeContract.token],
      [serverPlayerScopeContract.token]: this.serverPlayerContext.scopes[serverPlayerScopeContract.token],
      [duplexScopeToken.token]: new Scope(duplexScopeToken),
    });

    this.context = context;
    context.inject(webSocketDependency, socket);

    const duplexId = duplexIdCounter++;
    context.inject(duplexIdDependency, duplexId);

    const loggerFactory = context.resolve(loggerFactoryDependency);
    const logger = loggerFactory.createLogger("SRV-DUPLEX", {
      duplexId,
      gameId: context.resolve(serverGameIdDependency),
      playerId: context.resolve(serverPlayerIdDependency),
    });
    logifyWebSocket(logger, socket);
    context.inject(duplexLoggerDependency, logger);

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

  public dispose() {
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
  scopeToken: serverPlayerScopeContract,
});
