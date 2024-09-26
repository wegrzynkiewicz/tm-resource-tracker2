import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { clientGameScopeContract } from "../../bootstrap.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { logifyWebSocket, readySocket } from "@acme/web/socket.ts";
import { Scope } from "@acme/dependency/scopes.ts";
import { apiURLDependency } from "../api-url-config.ts";
import { createGameSocketPathname } from "../../../common/game/defs.ts";
import { wsScopeContract } from "../../../common/web-socket/ws-context.ts";
import { clientGameTokenDependency } from "./game-context.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";

export interface ClientPlayerWSContext {
  scope: Scope;
  resolver: DependencyResolver;
  socket: WebSocket;
}

export class ClientPlayerWSContextManager {
  public wsContext: ClientPlayerWSContext | null = null;

  public constructor(
    private readonly apiURL: URL,
    private readonly resolver: DependencyResolver,
    private readonly token: string,
  ) {}

  public async create(): Promise<ClientPlayerWSContext> {
    const url = new URL(createGameSocketPathname(this.token), this.apiURL);
    const socket = new WebSocket(url.toString());

    const scope = new Scope(wsScopeContract);
    const resolver = new DependencyResolver([...this.resolver.scopes, scope]);
    const ctx: ClientPlayerWSContext = { resolver, scope, socket };

    const loggerFactory = resolver.resolve(loggerFactoryDependency);
    const logger = loggerFactory.createLogger("PLAYER-WS");
    resolver.inject(loggerDependency, logger);

    logifyWebSocket(logger, socket);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });
    await readySocket(socket);

    return ctx;
  };

  public async dispose(): Promise<void> {
    if (this.wsContext === null) {
      return;
    }
    if (this.wsContext.socket.readyState === WebSocket.OPEN) {
      this.wsContext.socket.close();
    }
    this.wsContext = null;
  }

}

export function provideClientPlayerWSContextManager(resolver: DependencyResolver) {
  return new ClientPlayerWSContextManager(
    resolver.resolve(apiURLDependency),
    resolver,
    resolver.resolve(clientGameTokenDependency),
  );
}

export const clientPlayerWSContextManagerDependency = defineDependency({
  name: "client-player-ws-context-manager",
  provider: provideClientPlayerWSContextManager,
  scope: clientGameScopeContract,
});
