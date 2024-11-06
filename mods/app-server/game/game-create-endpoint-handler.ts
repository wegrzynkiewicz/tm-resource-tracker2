import { ServerGameContextManager, serverGameIdDependency, serverGameManagerDependency } from "./game-context.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { JSONRequestParser, jsonRequestParserDependency } from "../json-request-parser.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { EndpointHandler } from "@framework/web/defs.ts";
import { GameDTO } from "@common/game/game-dto.layout.compiled.ts";
import {
  serverPlayerContextManagerDependency,
  serverPlayerDTODependency,
  serverPlayerIdDependency,
} from "../player/player-context.ts";
import { webServerScopeToken } from "@framework/dependency/scopes.ts";
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
    const gameId = gameContext.resolve(serverGameIdDependency);

    const playerContextManager = gameContext.resolve(serverPlayerContextManagerDependency);
    const playerContext = await playerContextManager.create({ color, name, isAdmin });
    const playerId = playerContext.resolve(serverPlayerIdDependency);
    const player = playerContext.resolve(serverPlayerDTODependency);

    const token = this.tokenManager.createToken({ gameId, playerId });

    const payload: GameDTO = { gameId, player, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideGameCreateWebHandler(context: Context): EndpointHandler {
  return new GameCreateWebHandler(
    context.resolve(jsonRequestParserDependency),
    context.resolve(serverGameManagerDependency),
    context.resolve(tokenManagerDependency),
  );
}

export const gameCreateWebHandlerDependency = defineDependency({
  provider: provideGameCreateWebHandler,
  scopeToken: webServerScopeToken,
});
