import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { PlayerDTO } from "../../common/player/player-dto.layout.compiled.ts";
import { ServerGameContext } from "../game/game-context.ts";
import { ColorKey } from "../../common/color/color.layout.compiled.ts";
import { serverPlayerDuplexContextManagerDependency } from "./player-duplex-context.ts";
import { serverGameScopeContract, serverPlayerScopeContract } from "../defs.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";
import { DEBUG, loggerDependency } from "@acme/logger/defs.ts";

interface ServerPlayerContextIdentifier {
  gameId: string;
  playerId: string;
}

export type ServerPlayerContext = Context<ServerPlayerContextIdentifier>;

export interface ServerPlayerInput {
  color: ColorKey;
  name: string;
  isAdmin: boolean;
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
    private readonly gameContext: ServerGameContext,
  ) {}

  public async create(
    { color, isAdmin, name }: ServerPlayerInput,
  ): Promise<ServerPlayerContext> {
    const playerId = (++playerIdCounter).toString();
    const { gameId } = this.gameContext.identifier;

    const playerContext = createContext({
      identifier: { gameId, playerId },
      name: "PLR",
      scopes: {
        [globalScopeContract.token]: this.gameContext.scopes[globalScopeContract.token],
        [serverGameScopeContract.token]: this.gameContext.scopes[serverGameScopeContract.token],
        [serverPlayerScopeContract.token]: new Scope(serverPlayerScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });
    const { resolver } = playerContext;

    const player: PlayerDTO = {
      color,
      isAdmin,
      name,
      playerId,
    };

    resolver.inject(serverPlayerIdDependency, playerId);
    resolver.inject(serverPlayerDTODependency, player);

    const logger = resolver.resolve(loggerDependency);
    logger.log(DEBUG, "player-created");

    this.players.set(playerId, playerContext);
    this.creates.emit(playerContext);

    return playerContext;
  }

  public async dispose(playerId: string) {
    const ctx = this.players.get(playerId);
    if (ctx === undefined) {
      return;
    }
    const serverPlayerDuplexContextManager = ctx.resolver.resolve(serverPlayerDuplexContextManagerDependency);
    await serverPlayerDuplexContextManager.dispose();
    this.players.delete(playerId);
    this.deletes.emit(ctx);
  }

  public getPlayersDTO(): PlayerDTO[] {
    return [...this.players.values()].map((ctx) => ctx.resolver.resolve(serverPlayerDTODependency));
  }
}

export function provideServerPlayerContextManager(resolver: DependencyResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(contextDependency) as ServerGameContext,
  );
}

export const serverPlayerContextManagerDependency = defineDependency({
  name: "server-player-context-manager",
  provider: provideServerPlayerContextManager,
  scope: serverGameScopeContract,
});
