import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { clientGameScopeContract, frontendScopeContract } from "../../defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { readySocket } from "@acme/web/socket.ts";
import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { apiURLDependency } from "../api-url-config.ts";
import { createGameSocketPathname } from "../../../common/game/defs.ts";
import { wsDependency, wsScopeContract } from "../../../common/web-socket/ws-context.ts";
import { ClientGameContext, clientGameTokenDependency } from "./client-game-context.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";

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
    const gameContext = createContext({
      identifier: {
        gameId,
      },
      name: "CLIENT-WS",
      scopes: {
        [globalScopeContract.token]: this.clientGameContext.scopes[globalScopeContract.token],
        [frontendScopeContract.token]: this.clientGameContext.scopes[frontendScopeContract.token],
        [clientGameScopeContract.token]: this.clientGameContext.scopes[clientGameScopeContract.token],
        [wsScopeContract.token]: new Scope(wsScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });

    const { resolver } = gameContext;
    resolver.inject(wsDependency, socket);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });
    await readySocket(socket);

    return gameContext;
  };

  public async dispose(): Promise<void> {
    if (this.clientPlayerWSContext === null) {
      return;
    }
    const socket = this.clientPlayerWSContext.resolver.resolve(wsDependency);
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
