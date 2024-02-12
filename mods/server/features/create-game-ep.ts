import { assertObject, assertRequiredString } from "../../common/asserts.ts";
import { colorByKeys } from "../../common/colors.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { GameManager, provideGameManager } from "../game/game.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";

export interface CreateGameEPResponse {
  gameId: string;
  myPlayerId: number;
  token: string;
}

export interface CreateGameEPRequest {
  colorKey: string;
  name: string;
}

export function parseCreateGameEPRequest(data: unknown): CreateGameEPRequest {
  assertObject<CreateGameEPRequest>(data, 'payload-must-be-object');
  const { colorKey, name } = data;
  assertRequiredString(colorKey, 'color-must-be-required-string');
  assertRequiredString(name, 'name-must-be-required-string');
  return { colorKey, name };
}

export const createGameEPRoute = new EPRoute("POST", "/games");

export class CreateGameEPHandler implements EPHandler {
  public constructor(
    public readonly gameManager: GameManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const body = await request.json();
    const data = parseCreateGameEPRequest(body);
    const { colorKey, name } = data;

    const game = await this.gameManager.createGame();
    const { gameId, playerManager } = game;

    const color = colorByKeys.get(colorKey);
    assertObject(color, 'invalid-color-key');
    const player = playerManager.createPlayer(name, color);

    const payload: CreateGameEPResponse = {
      gameId,
      myPlayerId: player.playerId,
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
