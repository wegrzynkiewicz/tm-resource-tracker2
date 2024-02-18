import { assertObject } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { ServerGameContextManager, provideServerGameContextManager } from "../game/game.ts";
import { TokenManager, provideTokenManager } from "../game/token.ts";
import { provideServerPlayerDataManager } from "../player/data.ts";
import { parseAuthorizationToken } from "../useful.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";

export interface ReadGameEPResponse {
  colorKey: string;
  gameId: string;
  isAdmin: boolean;
  playerId: number;
  token: string;
}

export const readGameEPRoute = new EPRoute("GET", "/games");

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

    const playerDataManager = resolver.resolve(provideServerPlayerDataManager);
    const playerData = playerDataManager.players.get(playerId);
    assertObject(playerData, 'not-found-player-data', { status: 404 });
    const { color: { key: colorKey }, isAdmin } = playerData;

    const payload: ReadGameEPResponse = { colorKey, gameId, playerId, token, isAdmin };
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
