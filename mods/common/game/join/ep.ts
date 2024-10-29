import { assertObject, assertRequiredString } from "../../../core/asserts.ts";
import { assertColor, ColorKey } from "../../color/color.ts";
import { Context } from "@acme/dependency/service-resolver.ts";
import { provideServerGameContextManager, ServerGameContextManager } from "../server/context.ts";
import { provideTokenManager, TokenManager } from "../../token/manager.ts";
import { provideServerPlayerManager } from "../../player/server/manager.ts";
import { EPContext, EPHandler, EPRoute } from "../../../core/web/endpoint.ts";
import { GameResponse } from "../game.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";

export interface JoinGameEPRequest {
  color: ColorKey;
  gameId: string;
  name: string;
}

export function parseJoinGameEPRequest(data: unknown): JoinGameEPRequest {
  assertObject<JoinGameEPRequest>(data, "payload-must-be-object");
  const { color, name, gameId } = data;
  assertColor(color, "color-must-be-required-string");
  assertRequiredString(gameId, "game-id-must-be-required-string");
  assertRequiredString(name, "name-must-be-required-string");
  return { color, name, gameId };
}

export const joinGameEPRoute = new EPRoute("POST", "/games/join");

export class JoinGameEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) {}

  public async handle({ request }: EPContext): Promise<Response> {
    const body = await request.json();
    const input = parseJoinGameEPRequest(body);
    const { color, gameId, name } = input;
    const isAdmin = false;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, "not-found-game-with-this-token", { status: 404 });
    const { resolver } = gameContext;

    const playerManager = context.resolve(serverPlayerManagerDependency);
    const player = playerManager.createPlayer({ color, name, isAdmin });
    const { playerId } = player;

    const token = this.tokenManager.createToken({ gameId, playerId });

    const payload: GameResponse = { gameId, player, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideJoinGameEPHandler(context: Context) {
  return new JoinGameEPHandler(
    context.resolve(serverGameContextManagerDependency),
    context.resolve(tokenManagerDependency),
  );
}
export const joinGameEPHandlerDependency = defineDependency({
  provider: provideJoinGameEPHandler,
});
