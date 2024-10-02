import { GameDTO } from "../../common/game/game-dto.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { EndpointHandler } from "@acme/web/defs.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";
import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { serverPlayerContextManagerDependency, serverPlayerDTODependency } from "../player/player-context.ts";
import { webServerScopeContract } from "@acme/dependency/scopes.ts";
import { parseGameJoinC2SReqDTO } from "../../common/game/game-join-c2s-req-dto.layout.compiled.ts";

export class GameJoinEndpointHandler implements EndpointHandler {
  public constructor(
    public readonly parser: JSONRequestParser,
    public readonly gameManager: ServerGameContextManager,
    public readonly tokenManager: TokenManager,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const [status, data] = await this.parser.parse(parseGameJoinC2SReqDTO, request);
    if (status === false) {
      return data;
    }

    const { color, gameId, name } = data;
    const isAdmin = false;

    const gameContext = this.gameManager.games.get(gameId);
    if (gameContext === undefined) {
      return Response.json({ error: "game-not-found" }, { status: 404 });
    }

    const playerContextManager = gameContext.resolver.resolve(serverPlayerContextManagerDependency);
    const playerContext = await playerContextManager.create({ color, name, isAdmin });
    const { playerId } = playerContext.identifier;

    const player = playerContext.resolver.resolve(serverPlayerDTODependency);

    const token = this.tokenManager.createToken({ gameId, playerId });

    const payload: GameDTO = { gameId, player, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideGameJoinEndpointHandler(resolver: DependencyResolver): EndpointHandler {
  return new GameJoinEndpointHandler(
    resolver.resolve(jsonRequestParserDependency),
    resolver.resolve(serverGameManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}

export const gameJoinEndpointHandlerDependency = defineDependency({
  name: "game-join-web-handler",
  provider: provideGameJoinEndpointHandler,
  scope: webServerScopeContract,
});
