import { defineDependency, DependencyResolver } from "@acme/dependency/injection.ts";
import { WebHandler } from "@acme/web/common.ts";
import { ServerGameManager, serverGameManagerDependency } from "./game-scope.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";
import { parseAuthorizationToken } from "@acme/endpoint/build-in/token.ts";
import { jsonResponse } from "@acme/endpoint/payload-json.ts";
import { notFoundErrorResponseContract } from "@acme/endpoint/build-in/errors.ts";
import { serverPlayerManagerDependency } from "../player/server-player-manager.ts";
import { GameDTO } from "../../common/game/defs.ts";
import { gameReadResponseContract } from "../../common/game/game-read.ts";

export class GameReadWebHandler implements WebHandler {
  public constructor(
    public readonly parser: JSONRequestParser,
    public readonly gameManager: ServerGameManager,
    public readonly tokenManager: TokenManager,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const [authValid, result] = parseAuthorizationToken(request).toTuple();
    if (authValid === false) {
      return result;
    }
    const token = this.tokenManager.tokens.get(result);
    if (token === undefined) {
      return jsonResponse(notFoundErrorResponseContract, { error: "token-not-found" });
    }
    const { gameId, playerId } = token.identifier;

    const game = this.gameManager.games.get(gameId);
    if (game === undefined) {
      return jsonResponse(notFoundErrorResponseContract, { error: "game-not-found" });
    }
    const { resolver } = game.scope;

    const playerManager = resolver.resolve(serverPlayerManagerDependency);
    const player = playerManager.players.get(playerId);
    if (player === undefined) {
      return jsonResponse(notFoundErrorResponseContract, { error: "player-not-found" });
    }

    const payload: GameDTO = { gameId, player, token: token.key };
    const response = jsonResponse(gameReadResponseContract, payload);
    return response;
  }
}

export function provideGameReadWebHandler(resolver: DependencyResolver): WebHandler {
  return new GameReadWebHandler(
    resolver.resolve(jsonRequestParserDependency),
    resolver.resolve(serverGameManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}

export const gameReadWebHandlerDependency = defineDependency({
  kind: "game-read-web-handler",
  provider: provideGameReadWebHandler,
});
