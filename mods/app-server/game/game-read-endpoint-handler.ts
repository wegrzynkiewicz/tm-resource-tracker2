import { GameDTO } from "@common/game/game-dto.layout.compiled.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { EndpointHandler } from "@framework/web/defs.ts";
import { parseAuthorizationToken } from "@framework/web/build-in/token.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";
import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { serverPlayerContextManagerDependency, serverPlayerDTODependency } from "../player/player-context.ts";
import { webServerScopeToken } from "@framework/dependency/scopes.ts";

export class GameReadEndpointHandler implements EndpointHandler {
  public constructor(
    public readonly parser: JSONRequestParser,
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

    const manager = gameContext.resolve(serverPlayerContextManagerDependency);
    const ctx = manager.players.get(playerId);
    if (ctx === undefined) {
      return Response.json({ error: "player-not-found" }, { status: 404 });
    }
    const player = ctx.resolve(serverPlayerDTODependency);

    const payload: GameDTO = { gameId, player, token: token.key };
    const response = Response.json(payload);
    return response;
  }
}

export function provideGameReadEndpointHandler(context: Context): EndpointHandler {
  return new GameReadEndpointHandler(
    context.resolve(jsonRequestParserDependency),
    context.resolve(serverGameManagerDependency),
    context.resolve(tokenManagerDependency),
  );
}

export const gameReadEndpointHandlerDependency = defineDependency({
  provider: provideGameReadEndpointHandler,
  scopeToken: webServerScopeToken,
});
