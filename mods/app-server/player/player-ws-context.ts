import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { serverGameIdDependency, serverGameScopeContract } from "../game/game-context.ts";
import { logifyWebSocket } from "@acme/web/socket.ts";
import { serverPlayerScopeContract, serverPlayerWSScopeContract } from "../defs.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";
import { ServerPlayerContext } from "./player-context.ts";

export interface ServerPlayerWSContextIdentifier {
  gameId: string;
  playerId: string;
  wsId: string;
}

export type ServerPlayerWSContext = Context<ServerPlayerWSContextIdentifier>;

export let wsIdCounter = 0;

export class ServerPlayerWSContextManager {
  public context: ServerPlayerWSContext | null = null;

  public constructor(
    private readonly serverPlayerContext: ServerPlayerContext,
  ) {}

  public async create(
    { socket }: {
      socket: WebSocket,
    },
  ): Promise<ServerPlayerWSContext> {
    const { gameId, playerId } = this.serverPlayerContext.identifier;
    const wsId = (++wsIdCounter).toString();

    const serverPlayerWSContext = createContext({
      identifier: { gameId, playerId, wsId },
      name: "PLAYER",
      scopes: {
        [globalScopeContract.token]: this.serverPlayerContext.scopes[globalScopeContract.token],
        [serverGameScopeContract.token]: this.serverPlayerContext.scopes[serverGameScopeContract.token],
        [serverPlayerScopeContract.token]: this.serverPlayerContext.scopes[serverPlayerScopeContract.token],
        [serverPlayerWSScopeContract.token]: new Scope(serverPlayerWSScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });
    const { resolver } = serverPlayerWSContext;

    const logger = resolver.resolve(loggerDependency);
    logifyWebSocket(logger, socket);

    const onClose = () => this.dispose();
    socket.addEventListener("close", onClose, { once: true });

    return serverPlayerWSContext;

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
    // if (this.context.socket.readyState === WebSocket.OPEN) {
    //   this.context.socket.close();
    // }
    this.context = null;
  }
}

export function provideServerPlayerWSContextManager(resolver: DependencyResolver) {
  const s = performance.now();
  resolver.resolve(serverGameIdDependency)
  const e = performance.now();
  console.log(`ServerPlayerWSContextManager: ${e - s}ms`);

  return new ServerPlayerWSContextManager(
    resolver.resolve(contextDependency) as ServerPlayerContext,
  );
}

export const serverPlayerWSContextManagerDependency = defineDependency({
  name: "server-player-context-manager",
  provider: provideServerPlayerWSContextManager,
  scope: serverPlayerScopeContract,
});
