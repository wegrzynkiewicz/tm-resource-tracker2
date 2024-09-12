import { defineDependency, DependencyResolver } from "@acme/dependency/injection.ts";
import { WebHandler } from "@acme/web/common.ts";
import { ServerGameManager, serverGameManagerDependency } from "./game-scope.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { gameCreateRequestContract } from "../../common/game/game-create.ts";
import { GameDTO } from "../../common/game/defs.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";
import { serverPlayerManagerDependency } from "../player/server-player-manager.ts";

export class GameCreateWebHandler implements WebHandler {
  public constructor(
    public readonly parser: JSONRequestParser,
    public readonly gameManager: ServerGameManager,
    public readonly tokenManager: TokenManager,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const result = await this.parser.parse(gameCreateRequestContract, request);
    const [valid, data] = result.toTuple();
    if (valid === false) {
      return data;
    }

    const { color, name } = data.payload;
    const isAdmin = true;

    const game = this.gameManager.createServerGame();
    const { gameId, scope: { resolver } } = game;

    const playerDataManager = resolver.resolve(serverPlayerManagerDependency);
    const player = playerDataManager.createPlayer({ color, name, isAdmin });
    const { playerId } = player;

    const token = this.tokenManager.createToken({ gameId, playerId });

    const payload: GameDTO = { gameId, player, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideGameCreateWebHandler(resolver: DependencyResolver): WebHandler {
  return new GameCreateWebHandler(
    resolver.resolve(jsonRequestParserDependency),
    resolver.resolve(serverGameManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}
export const gameCreateWebHandlerDependency = defineDependency({
  kind: "game-create-web-handler",
  provider: provideGameCreateWebHandler,
});