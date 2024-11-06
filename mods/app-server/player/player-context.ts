import { globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
import { Channel } from "@acme/dom/channel.ts";
import { createInjectableProvider, defineDependency } from "@acme/dependency/declaration.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { ColorKey } from "@common/color/color.layout.compiled.ts";
import { serverPlayerDuplexContextManagerDependency } from "./player-duplex-context.ts";
import { serverGameScopeToken, serverPlayerScopeToken } from "../defs.ts";
import { playerCreatedChannelDependency, playerDeletedChannelDependency } from "./defs.ts";
import { Context } from "@acme/dependency/context.ts";

export interface ServerPlayerInput {
  color: ColorKey;
  name: string;
  isAdmin: boolean;
}

export const serverPlayerIdDependency = defineDependency<string>({
  provider: createInjectableProvider("server-player-id"),
  scopeToken: serverPlayerScopeToken,
});

export const serverPlayerDTODependency = defineDependency<PlayerDTO>({
  provider: createInjectableProvider("server-player-dto"),
  scopeToken: serverPlayerScopeToken,
});

export let playerIdCounter = 0;

export class ServerPlayerContextManager {
  public readonly players = new Map<string, Context>();

  public constructor(
    private readonly gameContext: Context,
    private readonly playerCreated: Channel<[Context, PlayerDTO]>,
    private readonly playerDeleted: Channel<[Context, PlayerDTO]>,
  ) {}

  public async create(
    { color, isAdmin, name }: ServerPlayerInput,
  ): Promise<Context> {
    const playerId = (++playerIdCounter).toString();

    const playerContext = new Context({
      [globalScopeToken]: this.gameContext.scopes[globalScopeToken],
      [serverGameScopeToken]: this.gameContext.scopes[serverGameScopeToken],
      [serverPlayerScopeToken]: new Scope(),
    });

    const player: PlayerDTO = {
      color,
      isAdmin,
      name,
      playerId,
    };

    playerContext.inject(serverPlayerIdDependency, playerId);
    playerContext.inject(serverPlayerDTODependency, player);

    // TODO: add player logger
    // const logger = playerContext.resolve(loggerDependency);
    // logger.log(DEBUG, "player-created");

    this.players.set(playerId, playerContext);
    this.playerCreated.emit(playerContext, player);

    return playerContext;
  }

  public async dispose(playerId: string) {
    const playerContext = this.players.get(playerId);
    if (playerContext === undefined) {
      return;
    }
    const player = playerContext.resolve(serverPlayerDTODependency);
    const serverPlayerDuplexContextManager = playerContext.resolve(serverPlayerDuplexContextManagerDependency);
    await serverPlayerDuplexContextManager.dispose();
    this.players.delete(playerId);
    this.playerDeleted.emit(playerContext, player);
  }

  public getPlayersDTO(): PlayerDTO[] {
    const players: PlayerDTO[] = [];
    for (const ctx of this.players.values()) {
      const player = ctx.resolve(serverPlayerDTODependency);
      players.push(player);
    }
    return players;
  }
}

export function provideServerPlayerContextManager(context: Context) {
  return new ServerPlayerContextManager(
    context,
    context.resolve(playerCreatedChannelDependency),
    context.resolve(playerDeletedChannelDependency),
  );
}

export const serverPlayerContextManagerDependency = defineDependency({
  provider: provideServerPlayerContextManager,
  scopeToken: serverGameScopeToken,
});
