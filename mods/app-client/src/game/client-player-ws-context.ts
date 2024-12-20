import { webSocketDependency } from "@framework/control-action/transport/defs.ts";
import { clientGameScopeToken, frontendScopeToken } from "../defs.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { readySocket } from "@framework/web/socket.ts";
import { duplexScopeToken, globalScopeToken, Scope } from "@framework/dependency/scopes.ts";
import { apiURLDependency } from "../api-url-config.ts";
import { createGameSocketPathname } from "@common/game/defs.ts";
import { clientGameTokenDependency } from "./client-game-context.ts";
import { Context } from "@framework/dependency/context.ts";
import {
  normalCAContextFactoryDependency,
  normalCADispatcherDependency,
  normalCARouterDependency,
  normalCASenderDependency,
} from "@framework/control-action/normal/defs.ts";
import { webSocketCAReceiverDependency } from "@framework/control-action/transport/ws-ca-receiver.ts";
import { webSocketNormalCASenderDependency } from "@framework/control-action/transport/ws-normal-ca-sender.ts";
import { webSocketNormalCADispatcherDependency } from "@framework/control-action/transport/ws-normal-ca-dispatcher.ts";
import { ClientNormalCAContextFactory } from "./client-normal-ca-context-factory.ts";
import { initClientNormalCARouter } from "../normal-ca-router.ts";
import { loggerFactoryDependency } from "@framework/logger/factory.ts";
import { duplexLoggerDependency } from "@framework/control-action/defs.ts";

export class ClientPlayerWSContextManager {
  public clientPlayerWSContext: Context | null = null;

  public constructor(
    private readonly apiURL: URL,
    private readonly clientGameContext: Context,
    private readonly token: string,
  ) {}

  public async create(): Promise<Context> {
    const url = new URL(createGameSocketPathname(this.token), this.apiURL);
    const socket = new WebSocket(url.toString());

    const context = new Context({
      [globalScopeToken]: this.clientGameContext.scopes[globalScopeToken],
      [frontendScopeToken]: this.clientGameContext.scopes[frontendScopeToken],
      [clientGameScopeToken]: this.clientGameContext.scopes[clientGameScopeToken],
      [duplexScopeToken]: new Scope(),
    });
    context.inject(webSocketDependency, socket);

    const loggerFactory = context.resolve(loggerFactoryDependency);
    const logger = loggerFactory.createLogger("CLT-DUPLEX");
    context.inject(duplexLoggerDependency, logger);

    const factory = new ClientNormalCAContextFactory(context);
    context.inject(normalCAContextFactoryDependency, factory);

    const router = initClientNormalCARouter();
    context.inject(normalCARouterDependency, router);

    const sender = context.resolve(webSocketNormalCASenderDependency);
    context.inject(normalCASenderDependency, sender);

    const dispatcher = context.resolve(webSocketNormalCADispatcherDependency);
    context.inject(normalCADispatcherDependency, dispatcher);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });

    const receiver = context.resolve(webSocketCAReceiverDependency);
    socket.addEventListener("message", (event) => receiver.receive(event));

    await readySocket(socket);

    this.clientPlayerWSContext = context;

    return context;
  }

  public async dispose(): Promise<void> {
    if (this.clientPlayerWSContext === null) {
      return;
    }
    const socket = this.clientPlayerWSContext.resolve(webSocketDependency);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    this.clientPlayerWSContext = null;
  }
}

export function provideClientPlayerWSContextManager(context: Context) {
  return new ClientPlayerWSContextManager(
    context.resolve(apiURLDependency),
    context,
    context.resolve(clientGameTokenDependency),
  );
}

export const clientPlayerWSContextManagerDependency = defineDependency({
  provider: provideClientPlayerWSContextManager,
  scopeToken: clientGameScopeToken,
});
