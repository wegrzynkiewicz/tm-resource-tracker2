import { assertObject } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { ServerGameContext, ServerGameContextManager, provideServerGameContextManager } from "../game/game.ts";
import { ServerPlayerContext, provideServerPlayerContextManager } from "./context.ts";
import { TokenManager, provideTokenManager } from "../game/token.ts";
import { providePlayerDataManager } from "./data.ts";
import { Player } from "../../player/data.ts";

export interface ServerPlayerContextResolverResult {
  readonly gameContext: ServerGameContext;
  readonly playerContext: ServerPlayerContext;
  readonly playerData: Player;
}

export class ServerPlayerContextResolver {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) { }

  public resolvePlayer(token: string): ServerPlayerContextResolverResult {
    const data = this.tokenManager.tokens.get(token);
    assertObject(data, 'not-found-token', { status: 404 });
    const { gameId, playerId } = data.identifier;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, 'not-found-game-with-this-token', { status: 404 });
    const { resolver } = gameContext;

    const playerContextManager = resolver.resolve(provideServerPlayerContextManager);
    const playerContext = playerContextManager.players.get(playerId);
    assertObject(playerContext, 'not-found-player-with-this-token', { status: 404 });

    const playerDataManager = resolver.resolve(providePlayerDataManager);
    const playerData = playerDataManager.players.get(playerId);
    assertObject(playerData, 'not-found-player-data-with-this-token', { status: 404 });

    return { gameContext, playerContext, playerData };
  }
}

export function provideServerPlayerContextResolver(resolver: ServiceResolver) {
  return new ServerPlayerContextResolver(
    resolver.resolve(provideServerGameContextManager),
    resolver.resolve(provideTokenManager),
  );
}
