import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { EndpointHandler } from "@acme/web/defs.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { Data } from "@acme/useful/types.ts";
import { parseNotEmptyString } from "@acme/layout/runtime/parsers.ts";
import { ErrorDTO } from "@acme/web/docs/error-dto.layout.compiled.ts";
import { serverPlayerManagerDependency } from "../player/player-manager.ts";
import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { serverPlayerContextManagerDependency } from "../player/player-context.ts";
import { webServerScopeContract } from "@acme/dependency/scopes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";

export class GameSocketEndpointHandler implements EndpointHandler {

  public constructor(
    public readonly gameManager: ServerGameContextManager,
    public readonly tokenManager: TokenManager,
  ) {}

  public async handle(request: Request, params: Data): Promise<Response> {
    const [status, result] = parseNotEmptyString(params.token);
    if (status === false) {
      const payload: ErrorDTO = { error: "invalid-token" };
      return Response.json(payload, { status: 400 });
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
    const player = playerManager.players.get(playerId);
    if (player === undefined) {
      return Response.json({ error: "player-not-found" }, { status: 404 });
    }

    const { response, socket } = Deno.upgradeWebSocket(request);

    const playerContextManager = gameContext.resolver.resolve(serverPlayerContextManagerDependency);
    await playerContextManager.createServerPlayerContext({ playerId, socket });

    return response;
  }
}

export function provideGameSocketEndpointHandler(resolver: DependencyResolver): EndpointHandler {
  return new GameSocketEndpointHandler(
    resolver.resolve(serverGameManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}

export const gameSocketEndpointHandlerDependency = defineDependency({
  name: "game-socket-web-handler",
  provider: provideGameSocketEndpointHandler,
  scope: webServerScopeContract
});
