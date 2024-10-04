import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { EndpointHandler } from "@acme/web/defs.ts";
import { GameDTO } from "@common/game/game-dto.layout.compiled.ts";
import { serverPlayerContextManagerDependency, serverPlayerDTODependency } from "../player/player-context.ts";
import { webServerScopeContract } from "@acme/dependency/scopes.ts";
import { parseGameCreateC2SReqDTO } from "@common/game/game-create-c2s-req-dto.layout.compiled.ts";

export class GameCreateWebHandler implements EndpointHandler {
  public constructor(
    public readonly parser: JSONRequestParser,
    public readonly gameManager: ServerGameContextManager,
    public readonly tokenManager: TokenManager,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const [status, data] = await this.parser.parse(parseGameCreateC2SReqDTO, request);
    if (status === false) {
      return data;
    }

    const { color, name } = data;
    const isAdmin = true;

    const gameContext = this.gameManager.createServerGameContext();
    const { gameId } = gameContext.identifier;

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

export function provideGameCreateWebHandler(resolver: DependencyResolver): EndpointHandler {
  return new GameCreateWebHandler(
    resolver.resolve(jsonRequestParserDependency),
    resolver.resolve(serverGameManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}

export const gameCreateWebHandlerDependency = defineDependency({
  provider: provideGameCreateWebHandler,
  scope: webServerScopeContract,
});
