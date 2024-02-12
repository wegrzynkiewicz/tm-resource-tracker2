import { assertObject } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { GameManager, provideGameManager } from "../game/game.ts";
import { PlayerDTO } from "../game/player.ts";
import { TokenManager, provideTokenManager } from "../game/token.ts";
import { parseAuthorizationToken } from "../useful.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";

export interface ReadGameEPResponse {
  gameId: string;
  myPlayerId: number;
  players: PlayerDTO[];
}

export const readGameEPRoute = new EPRoute("GET", "/games");

export class ReadGameEPHandler implements EPHandler {
  public constructor(
    private tokenManager: TokenManager,
    private gameManager: GameManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const token = parseAuthorizationToken(request);
    const data = this.tokenManager.tokens.get(token);
    assertObject(data, 'not-found-token', { status: 404 });
    const { gameId, playerId } = data;
    const game = this.gameManager.games.get(gameId);
    assertObject(game, 'not-found-game-with-this-token', { status: 404 });

    const players = [...game.playerManager.fetchPlayers()];
    const payload: ReadGameEPResponse = {
      gameId,
      myPlayerId: playerId,
      players,
    };
    const response = Response.json(payload);
    return response;
  }
}

export function provideReadGameEPHandler(resolver: ServiceResolver) {
  return new ReadGameEPHandler(
    resolver.resolve(provideTokenManager),
    resolver.resolve(provideGameManager),
  );
}
