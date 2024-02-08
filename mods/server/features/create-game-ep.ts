import { colors } from "../../common/colors.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { GameManager, provideGameManager } from "../game/game.ts";
import { EPRoute, EPHandler } from "../web/endpoint.ts";

export interface CreateGameEPResponse {
  gameId: string;
  token: string;
}

export const createGameEPRoute = new EPRoute("POST", "/games");

export class CreateGameEPHandler implements EPHandler {
  public constructor(
    public readonly gameManager: GameManager,
  ) { }

  public async handle(): Promise<Response> {
    const game = await this.gameManager.createGame();
    const { gameId, playerManager } = game;
    const player = playerManager.createPlayer('', colors[0]);

    const payload: CreateGameEPResponse = {
      gameId,
      token: player.token.key,
    };
    const response = Response.json(payload);
    return response;
  }
}

export function provideCreateGameEPHandler(resolver: ServiceResolver) {
  return new CreateGameEPHandler(
    resolver.resolve(provideGameManager),
  );
}
