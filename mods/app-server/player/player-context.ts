import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { ServerGameContext } from "../game/game-context.ts";
import { ColorKey } from "@common/color/color.layout.compiled.ts";
import { serverPlayerDuplexContextManagerDependency } from "./player-duplex-context.ts";
import { serverGameScopeContract, serverPlayerScopeContract } from "../defs.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";
import { DEBUG, loggerDependency } from "@acme/logger/defs.ts";
import { playerCreatedChannelDependency, playerDeletedChannelDependency } from "./defs.ts";

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

  public constructor(
    private readonly gameContext: ServerGameContext,
    private readonly playerCreated: Channel<[ServerPlayerContext, PlayerDTO]>,
    private readonly playerDeleted: Channel<[ServerPlayerContext, PlayerDTO]>,
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
    this.playerCreated.emit(playerContext, player);

    return playerContext;
  }

  public async dispose(playerId: string) {
    const playerContext = this.players.get(playerId);
    if (playerContext === undefined) {
      return;
    }
    const player = playerContext.resolver.resolve(serverPlayerDTODependency);
    const serverPlayerDuplexContextManager = playerContext.resolver.resolve(serverPlayerDuplexContextManagerDependency);
    await serverPlayerDuplexContextManager.dispose();
    this.players.delete(playerId);
    this.playerDeleted.emit(playerContext, player);
  }

  public getPlayersDTO(): PlayerDTO[] {
    const players: PlayerDTO[] = [];
    for (const ctx of this.players.values()) {
      const player = ctx.resolver.resolve(serverPlayerDTODependency);
      players.push(player);
    }
    return players;
  }
}

export function provideServerPlayerContextManager(resolver: DependencyResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(contextDependency) as ServerGameContext,
    resolver.resolve(playerCreatedChannelDependency),
    resolver.resolve(playerDeletedChannelDependency),
  );
}

export const serverPlayerContextManagerDependency = defineDependency({
  name: "server-player-context-manager",
  provider: provideServerPlayerContextManager,
  scope: serverGameScopeContract,
});
