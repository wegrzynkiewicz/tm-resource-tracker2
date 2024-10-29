import { assertObject } from "../../../core/asserts.ts";
import { Context } from "@acme/dependency/service-resolver.ts";
import { provideServerGameContextManager, ServerGameContextManager } from "../server/context.ts";
import { provideTokenManager, TokenManager } from "../../token/manager.ts";
import { provideServerPlayerContextManager } from "../../player/server/context.ts";
import { provideServerPlayerManager } from "../../player/server/manager.ts";
import { parseAuthorizationToken } from "../../token/common.ts";
import { EPContext, EPHandler, EPRoute } from "../../../core/web/endpoint.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";

export const quitGameEPRoute = new EPRoute("POST", "/games/quit");

export class QuitGameEPHandler implements EPHandler {
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

    const playerManager = context.resolve(serverPlayerManagerDependency);
    playerManager.deletePlayer(playerId);

    const playerContextManager = context.resolve(serverPlayerContextManagerDependency);
    await playerContextManager.deletePlayerContext(playerId);

    return new Response(null, { status: 204 });
  }
}

export function provideQuitGameEPHandler(context: Context) {
  return new QuitGameEPHandler(
    context.resolve(serverGameContextManagerDependency),
    context.resolve(tokenManagerDependency),
  );
}
export const quitGameEPHandlerDependency = defineDependency({
  provider: provideQuitGameEPHandler,
});
