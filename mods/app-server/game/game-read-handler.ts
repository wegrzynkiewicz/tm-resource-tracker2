import { GameDTO } from "../../common/game/game-dto.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { EndpointHandler } from "@acme/web/defs.ts";
import { parseAuthorizationToken } from "@acme/web/build-in/token.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";
import { serverPlayerManagerDependency } from "../player/player-manager.ts";
import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";

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

    const playerManager = gameContext.resolver.resolve(serverPlayerManagerDependency);
    const player = playerManager.players.get(playerId);
    if (player === undefined) {
      return Response.json({ error: "player-not-found" }, { status: 404 });
    }

    const payload: GameDTO = { gameId, player, token: token.key };
    const response = Response.json(payload);
    return response;
  }
}

export function provideGameReadEndpointHandler(resolver: DependencyResolver): EndpointHandler {
  return new GameReadEndpointHandler(
    resolver.resolve(jsonRequestParserDependency),
    resolver.resolve(serverGameManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}

export const gameReadEndpointHandlerDependency = defineDependency({
  name: "game-read-web-handler",
  provider: provideGameReadEndpointHandler,
});
