import { webSocketDependency } from "@acme/control-action/transport/defs.ts";
import { clientGameScopeToken, frontendScopeToken } from "../defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { readySocket } from "@acme/web/socket.ts";
import { duplexScopeToken, globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
import { apiURLDependency } from "../api-url-config.ts";
import { createGameSocketPathname } from "@common/game/defs.ts";
import { clientGameTokenDependency } from "./client-game-context.ts";
import { Context } from "@acme/dependency/context.ts";
import {
  normalCAContextFactoryDependency,
  normalCADispatcherDependency,
  normalCARouterDependency,
  normalCASenderDependency,
} from "@acme/control-action/normal/defs.ts";
import { webSocketCAReceiverDependency } from "@acme/control-action/transport/ws-ca-receiver.ts";
import { webSocketNormalCASenderDependency } from "@acme/control-action/transport/ws-normal-ca-sender.ts";
import { webSocketNormalCADispatcherDependency } from "@acme/control-action/transport/ws-normal-ca-dispatcher.ts";
import { ClientNormalCAContextFactory } from "./client-normal-ca-context-factory.ts";
import { initClientNormalCARouter } from "../normal-ca-router.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";
import { duplexLoggerDependency } from "@acme/control-action/defs.ts";

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
      [globalScopeToken.token]: this.clientGameContext.scopes[globalScopeToken.token],
      [frontendScopeToken.token]: this.clientGameContext.scopes[frontendScopeToken.token],
      [clientGameScopeToken.token]: this.clientGameContext.scopes[clientGameScopeToken.token],
      [duplexScopeToken.token]: new Scope(duplexScopeToken),
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
