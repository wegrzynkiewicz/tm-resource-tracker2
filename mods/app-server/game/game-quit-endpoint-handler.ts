import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { EndpointHandler } from "@acme/web/defs.ts";
import { parseAuthorizationToken } from "@acme/web/build-in/token.ts";
import { serverPlayerContextManagerDependency } from "../player/player-context.ts";
import { webServerScopeContract } from "@acme/dependency/scopes.ts";

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

    const playerContextManager = gameContext.resolver.resolve(serverPlayerContextManagerDependency);
    await playerContextManager.dispose(playerId);

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
  provider: provideGameQuitEndpointHandler,
  scope: webServerScopeContract,
});
