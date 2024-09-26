import { Scope } from "@acme/dependency/scopes.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";
import { PlayerDTO } from "../../common/player/player.layout.compiled.ts";
import { serverGameIdDependency, serverGameScopeContract } from "../game/game-context.ts";
import { ColorKey } from "../../common/color/color.layout.compiled.ts";
import { serverPlayerWSContextManagerDependency } from "./player-ws-context.ts";
import { serverPlayerScopeContract } from "../defs.ts";

export interface ServerPlayerContext {
  gameId: string;
  playerId: string;
  scope: Scope;
  resolver: DependencyResolver;
}

export interface ServerPlayerInput {
  color: ColorKey;
  name: string;
  isAdmin: boolean;
}

export interface Context {
  
  resolver: DependencyResolver;
}

export const serverPlayerIdDependency = defineDependency<string>({ 
  name: "player-id",
  scope: serverPlayerScopeContract,
});
export const serverPlayerDTODependency = defineDependency<PlayerDTO>({ 
  name: "player-dto",
  scope: serverPlayerScopeContract,
});

export let playerIdCounter = 0;

export class ServerPlayerContextManager {
  public readonly players = new Map<string, ServerPlayerContext>();
  public readonly creates = new Channel<[ServerPlayerContext]>();
  public readonly deletes = new Channel<[ServerPlayerContext]>();

  public constructor(
    private readonly gameId: string,
    private readonly resolver: DependencyResolver,
  ) {}

  public async create(
    { color, isAdmin, name }: ServerPlayerInput
  ): Promise<ServerPlayerContext> {
    const { gameId } = this;
    const playerId = (++playerIdCounter).toString();

    const scope = new Scope(serverPlayerScopeContract);
    const resolver = new DependencyResolver([...this.resolver.scopes, scope]);
    const ctx: ServerPlayerContext = { gameId, playerId, resolver, scope };

    const loggerFactory = resolver.resolve(loggerFactoryDependency);
    const logger = loggerFactory.createLogger("PLAYER", { gameId });
    resolver.inject(loggerDependency, logger);

    const player: PlayerDTO = {
      color,
      isAdmin,
      name,
      playerId,
    };

    resolver.inject(serverPlayerIdDependency, playerId);
    resolver.inject(serverPlayerDTODependency, player);

    this.players.set(playerId, ctx);
    this.creates.emit(ctx);

    return ctx;
  }

  public async dispose(playerId: string) {
    const ctx = this.players.get(playerId);
    if (ctx === undefined) {
      return;
    }
    const netManager = ctx.resolver.resolve(serverPlayerWSContextManagerDependency);
    await netManager.dispose();
    this.players.delete(playerId);
    this.deletes.emit(ctx);
  }
}

export function provideServerPlayerContextManager(resolver: DependencyResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(serverGameIdDependency),
    resolver,
  );
}

export const serverPlayerContextManagerDependency = defineDependency({
  name: "server-player-context-manager",
  provider: provideServerPlayerContextManager,
  scope: serverGameScopeContract,
});
