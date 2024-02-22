import { assertObject } from "../../../common/asserts.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GameResponse } from "../../../domain/game.ts";
import { ServerGameContextManager, provideServerGameContextManager } from "../game/game.ts";
import { TokenManager, provideTokenManager } from "../game/token.ts";
import { provideServerPlayerManager } from "../player/data.ts";
import { parseAuthorizationToken } from "../useful.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";

export const readGameEPRoute = new EPRoute("GET", "/games/read");

export class ReadGameEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const token = parseAuthorizationToken(request);

    const data = this.tokenManager.tokens.get(token);
    assertObject(data, 'not-found-token', { status: 404 });
    const { gameId, playerId } = data.identifier;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, 'not-found-game-with-this-token', { status: 404 });
    const { resolver } = gameContext;

    const playerManager = resolver.resolve(provideServerPlayerManager);
    const player = playerManager.players.get(playerId);
    assertObject(player, 'not-found-player-data', { status: 404 });

    const payload: GameResponse = { gameId, player, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideReadGameEPHandler(resolver: ServiceResolver) {
  return new ReadGameEPHandler(
    resolver.resolve(provideServerGameContextManager),
    resolver.resolve(provideTokenManager),
  );
}
