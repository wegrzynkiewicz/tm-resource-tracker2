import { assertObject, assertRequiredString } from "../../../core/asserts.ts";
import { ColorKey, assertColor } from "../../color/color.ts";
import { ServiceResolver } from "../../../core/dependency.ts";
import { ServerGameContextManager, provideServerGameContextManager } from "../server/context.ts";
import { TokenManager, provideTokenManager } from "../../token/manager.ts";
import { provideServerPlayerManager } from "../../player/server/manager.ts";
import { EPRoute, EPHandler, EPContext } from "../../../core/web/endpoint.ts";
import { GameResponse } from "../game.ts";

export interface JoinGameEPRequest {
  color: ColorKey;
  gameId: string;
  name: string;
}

export function parseJoinGameEPRequest(data: unknown): JoinGameEPRequest {
  assertObject<JoinGameEPRequest>(data, 'payload-must-be-object');
  const { color, name, gameId } = data;
  assertColor(color, 'color-must-be-required-string');
  assertRequiredString(gameId, 'game-id-must-be-required-string');
  assertRequiredString(name, 'name-must-be-required-string');
  return { color, name, gameId };
}

export const joinGameEPRoute = new EPRoute("POST", "/games/join");

export class JoinGameEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const body = await request.json();
    const input = parseJoinGameEPRequest(body);
    const { color, gameId, name } = input;
    const isAdmin = false;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, 'not-found-game-with-this-token', { status: 404 });
    const { resolver } = gameContext;

    const playerManager = resolver.resolve(provideServerPlayerManager);
    const player = playerManager.createPlayer({ color, name, isAdmin });
    const { playerId } = player;

    const token = this.tokenManager.createToken({ gameId, playerId });

    const payload: GameResponse = { gameId, player, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideJoinGameEPHandler(resolver: ServiceResolver) {
  return new JoinGameEPHandler(
    resolver.resolve(provideServerGameContextManager),
    resolver.resolve(provideTokenManager),
  );
}
