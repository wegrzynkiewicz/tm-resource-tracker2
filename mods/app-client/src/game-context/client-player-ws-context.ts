import { webSocketDependency } from "@acme/control-action/transport/defs.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { clientGameScopeContract, frontendScopeContract } from "../../defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { readySocket } from "@acme/web/socket.ts";
import { duplexScopeContract, globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { apiURLDependency } from "../api-url-config.ts";
import { createGameSocketPathname } from "../../../common/game/defs.ts";
import { ClientGameContext, clientGameTokenDependency } from "./client-game-context.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";
import {
  normalCAContextFactoryDependency,
  normalCADispatcherDependency,
  normalCARouterDependency,
  normalCASenderDependency,
} from "@acme/control-action/normal/defs.ts";
import { webSocketCAReceiverDependency } from "@acme/control-action/transport/ws-ca-receiver.ts";
import { webSocketNormalCASenderDependency } from "@acme/control-action/transport/ws-normal-ca-sender.ts";
import { webSocketNormalCADispatcherDependency } from "@acme/control-action/transport/ws-normal-ca-dispatcher.ts";
import { initClientNormalCARouter } from "../game-actions/normal-ca-router.ts";
import { ClientNormalCAContextFactory } from "./client-normal-ca-context-factory.ts";

export interface ClientPlayerWSContextIdentifier {
  gameId: string;
}

export type ClientPlayerWSContext = Context<ClientPlayerWSContextIdentifier>;

export class ClientPlayerWSContextManager {
  public clientPlayerWSContext: ClientPlayerWSContext | null = null;

  public constructor(
    private readonly apiURL: URL,
    private readonly clientGameContext: ClientGameContext,
    private readonly token: string,
  ) {}

  public async create(): Promise<ClientPlayerWSContext> {
    const url = new URL(createGameSocketPathname(this.token), this.apiURL);
    const socket = new WebSocket(url.toString());

    const { gameId } = this.clientGameContext.identifier;
    const clientPlayerWSContext = createContext({
      identifier: {
        gameId,
      },
      name: "CLIENT-WS",
      scopes: {
        [globalScopeContract.token]: this.clientGameContext.scopes[globalScopeContract.token],
        [frontendScopeContract.token]: this.clientGameContext.scopes[frontendScopeContract.token],
        [clientGameScopeContract.token]: this.clientGameContext.scopes[clientGameScopeContract.token],
        [duplexScopeContract.token]: new Scope(duplexScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });
    const { resolver } = clientPlayerWSContext;
    resolver.inject(webSocketDependency, socket);

    const factory = new ClientNormalCAContextFactory(clientPlayerWSContext);
    resolver.inject(normalCAContextFactoryDependency, factory);

    const router = initClientNormalCARouter();
    resolver.inject(normalCARouterDependency, router);

    const sender = resolver.resolve(webSocketNormalCASenderDependency);
    resolver.inject(normalCASenderDependency, sender);

    const dispatcher = resolver.resolve(webSocketNormalCADispatcherDependency);
    resolver.inject(normalCADispatcherDependency, dispatcher);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });

    const receiver = resolver.resolve(webSocketCAReceiverDependency);
    socket.addEventListener("message", (event) => receiver.receive(event));

    await readySocket(socket);

    this.clientPlayerWSContext = clientPlayerWSContext;

    return clientPlayerWSContext;
  }

  public async dispose(): Promise<void> {
    if (this.clientPlayerWSContext === null) {
      return;
    }
    const socket = this.clientPlayerWSContext.resolver.resolve(webSocketDependency);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    this.clientPlayerWSContext = null;
  }
}

export function provideClientPlayerWSContextManager(resolver: DependencyResolver) {
  return new ClientPlayerWSContextManager(
    resolver.resolve(apiURLDependency),
    resolver.resolve(contextDependency) as ClientGameContext,
    resolver.resolve(clientGameTokenDependency),
  );
}

export const clientPlayerWSContextManagerDependency = defineDependency({
  name: "client-player-ws-context-manager",
  provider: provideClientPlayerWSContextManager,
  scope: clientGameScopeContract,
});
