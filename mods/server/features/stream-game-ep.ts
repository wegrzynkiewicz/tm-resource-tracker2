import { assertObject, assertRequiredString } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { EPRoute, EPHandler, EPContext } from "../web/endpoint.ts";
import { provideWebSocket } from "../../communication/socket.ts";
import { providePlayerConnector } from "../player/connector.ts";
import { ServerGameContextManager, provideServerGameContextManager } from "../game/game.ts";
import { TokenManager, provideTokenManager } from "../game/token.ts";
import { provideServerPlayerContextManager } from "../player/context.ts";

export interface PlayerWebSocketEPParams {
  token: string;
}

export function parsePlayerWebSocketEPRequest(value: unknown): PlayerWebSocketEPParams {
  assertObject<PlayerWebSocketEPParams>(value, "player-web-socket-params-must-be-object");
  const { token } = value;
  assertRequiredString(token, "player-web-socket-params-token-must-be-string");
  return { token };
}

export const playerWebSocketEPRoute = new EPRoute("GET", "/player-web-socket/:token");

export class PlayerWebSocketEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) { }

  public async handle({ params, request }: EPContext): Promise<Response> {
    const { token } = parsePlayerWebSocketEPRequest(params);

    const data = this.tokenManager.tokens.get(token);
    assertObject(data, 'not-found-token', { status: 404 });
    const { gameId, playerId } = data.identifier;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, 'not-found-game-with-this-token', { status: 404 });
    const { resolver } = gameContext;

    const { response, socket } = Deno.upgradeWebSocket(request);

    const playerContextManager = resolver.resolve(provideServerPlayerContextManager);
    playerContextManager.createServerPlayerContext({ playerId, socket});
    
    return response;
  }
}

export function providePlayerWebSocketEPHandler(resolver: ServiceResolver) {
  return new PlayerWebSocketEPHandler(
    resolver.resolve(provideServerGameContextManager),
    resolver.resolve(provideTokenManager),
  );
}
