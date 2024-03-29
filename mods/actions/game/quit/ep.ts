import { assertObject } from "../../../common/asserts.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { ServerGameContextManager, provideServerGameContextManager } from "../server/context.ts";
import { TokenManager, provideTokenManager } from "../../token/manager.ts";
import { provideServerPlayerContextManager } from "../../player/server/context.ts";
import { provideServerPlayerManager } from "../../player/server/manager.ts";
import { parseAuthorizationToken } from "../../token/common.ts";
import { EPContext, EPHandler, EPRoute } from "../../../common/web/endpoint.ts";

export const quitGameEPRoute = new EPRoute("POST", "/games/quit");

export class QuitGameEPHandler implements EPHandler {
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
    playerManager.deletePlayer(playerId);

    const playerContextManager = resolver.resolve(provideServerPlayerContextManager);
    await playerContextManager.deletePlayerContext(playerId);

    return new Response(null, { status: 204 });
  }
}

export function provideQuitGameEPHandler(resolver: ServiceResolver) {
  return new QuitGameEPHandler(
    resolver.resolve(provideServerGameContextManager),
    resolver.resolve(provideTokenManager),
  );
}
