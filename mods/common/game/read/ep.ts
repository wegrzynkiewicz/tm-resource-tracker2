import { assertObject } from "../../../core/asserts.ts";
import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { GameResponse } from "../game.ts";
import { provideServerGameContextManager, ServerGameContextManager } from "../server/context.ts";
import { provideTokenManager, TokenManager } from "../../token/manager.ts";
import { provideServerPlayerManager } from "../../player/server/manager.ts";
import { parseAuthorizationToken } from "../../token/common.ts";
import { EPContext, EPHandler, EPRoute } from "../../../core/web/endpoint.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";

export const readGameEPRoute = new EPRoute("GET", "/games/read");

export class ReadGameEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) {}

  public async handle({ request }: EPContext): Promise<Response> {
    const token = parseAuthorizationToken(request);

    const data = this.tokenManager.tokens.get(token);
    assertObject(data, "not-found-token", { status: 404 });
    const { gameId, playerId } = data.identifier;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, "not-found-game-with-this-token", { status: 404 });
    const { resolver } = gameContext;

    const playerManager = resolver.resolve(serverPlayerManagerDependency);
    const player = playerManager.players.get(playerId);
    assertObject(player, "not-found-player-data", { status: 404 });

    const payload: GameResponse = { gameId, player, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideReadGameEPHandler(resolver: DependencyResolver) {
  return new ReadGameEPHandler(
    resolver.resolve(serverGameContextManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}
export const readGameEPHandlerDependency = defineDependency({
  name: "read-game-ep-handler",
  provider: provideReadGameEPHandler,
});
