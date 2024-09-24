import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { serverPlayerManagerDependency } from "../player/player-manager.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { EndpointHandler } from "@acme/web/defs.ts";
import { parseAuthorizationToken } from "@acme/web/build-in/token.ts";

export class GameQuitEndpointHandler implements EndpointHandler {
  public constructor(
    public readonly gameManager: ServerGameContextManager,
    public readonly tokenManager: TokenManager,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const [authStatus, result] = parseAuthorizationToken(request);
    if (authStatus === false) {
      return result;
    }
    const token = this.tokenManager.tokens.get(result);
    if (token === undefined) {
      return Response.json({ error: "token-not-found" }, { status: 401 });
    }
    const { gameId, playerId } = token.identifier;

    const gameContext = this.gameManager.games.get(gameId);
    if (gameContext === undefined) {
      return Response.json({ error: "game-not-found" }, { status: 404 });
    }

    const playerManager = gameContext.resolver.resolve(serverPlayerManagerDependency);
    playerManager.deletePlayer(playerId);

    return new Response(null, { status: 204 });
  }
}

export function provideGameQuitEndpointHandler(resolver: DependencyResolver): EndpointHandler {
  return new GameQuitEndpointHandler(
    resolver.resolve(serverGameManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}

export const gameQuitEndpointHandlerDependency = defineDependency({
  name: "game-quit-web-handler",
  provider: provideGameQuitEndpointHandler,
});
