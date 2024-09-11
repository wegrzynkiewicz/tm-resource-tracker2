import { defineDependency, DependencyResolver } from "@acme/dependency/injection.ts";
import { WebHandler } from "@acme/web/common.ts";
import { ServerGameScopeManager, serverGameScopeManagerDependency } from "./game-scope.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { gameCreateRequestContract } from "../../common/game/create/common.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";

export class GameCreateWebHandler implements WebHandler {
  public constructor(
    public readonly parser: JSONRequestParser,
    public readonly gameManager: ServerGameScopeManager,
    public readonly tokenManager: TokenManager,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const result = await this.parser.parse(gameCreateRequestContract, request);
    const [valid, payload] = result.toTuple();
    if (valid === false) {
      return payload;
    }

    return Response.json({ message: "hello" });
    // const body = await request.json();
    // const data = parseUsingLayout(myPlayerUpdateLayout, body).unwrap('invalid-payload', { status: 400 });
    // const { color, name } = data;
    // const isAdmin = true;

    // const gameContext = this.gameContextManager.createServerGameContext();
    // const { identifier: { gameId }, resolver } = gameContext;

    // const playerDataManager = resolver.resolve(serverPlayerManagerDependency);
    // const player = playerDataManager.createPlayer({ color, name, isAdmin });
    // const { playerId } = player;

    // const token = this.tokenManager.createToken({ gameId, playerId });

    // const payload: Game = { gameId, player, token };
    // const response = Response.json(payload);
    // return response;
  }
}

export function provideGameCreateWebHandler(resolver: DependencyResolver): WebHandler {
  return new GameCreateWebHandler(
    resolver.resolve(jsonRequestParserDependency),
    resolver.resolve(serverGameScopeManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}
export const gameCreateWebHandlerDependency = defineDependency({
  kind: "game-create-web-handler",
  provider: provideGameCreateWebHandler,
});
