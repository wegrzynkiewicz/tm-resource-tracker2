import { Context } from "@acme/dependency/context.ts";
import { EndpointHandler } from "@acme/web/defs.ts";
import { TokenManager, tokenManagerDependency } from "./token-manager.ts";
import { Data } from "@acme/useful/types.ts";
import { parseNotEmptyString } from "@acme/layout/runtime/parsers.ts";
import { ErrorDTO } from "@acme/web/docs/error-dto.layout.compiled.ts";
import { ServerGameContextManager, serverGameManagerDependency } from "./game-context.ts";
import { serverPlayerContextManagerDependency } from "../player/player-context.ts";
import { webServerScopeContract } from "@acme/dependency/scopes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { serverPlayerDuplexContextManagerDependency } from "../player/player-duplex-context.ts";

export class GameSocketEndpointHandler implements EndpointHandler {
  public constructor(
    public readonly gameContextManager: ServerGameContextManager,
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

    const gameContext = this.gameContextManager.games.get(gameId);
    if (gameContext === undefined) {
      return Response.json({ error: "game-not-found" }, { status: 404 });
    }
    const playerContextManager = gameContext.resolve(serverPlayerContextManagerDependency);
    const playerContext = playerContextManager.players.get(playerId);
    if (playerContext === undefined) {
      return Response.json({ error: "player-not-found" }, { status: 404 });
    }

    const { response, socket } = Deno.upgradeWebSocket(request);

    const playerDuplexContextManager = playerContext.resolve(serverPlayerDuplexContextManagerDependency);

    const onOpen = () => {
      playerDuplexContextManager.createServerPlayerDuplexContext(socket);
    };
    socket.addEventListener("open", onOpen, { once: true });

    return response;
  }
}

export function provideGameSocketEndpointHandler(context: Context): EndpointHandler {
  return new GameSocketEndpointHandler(
    context.resolve(serverGameManagerDependency),
    context.resolve(tokenManagerDependency),
  );
}

export const gameSocketEndpointHandlerDependency = defineDependency({
  provider: provideGameSocketEndpointHandler,
  scope: webServerScopeContract,
});
