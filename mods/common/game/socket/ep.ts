import { assertObject } from "../../../core/asserts.ts";
import { ServiceResolver } from "../../../core/dependency.ts";
import { EPHandler, EPContext } from "../../../core/web/endpoint.ts";
import { ServerGameContextManager, provideServerGameContextManager } from "../server/context.ts";
import { TokenManager, provideTokenManager } from "../../token/manager.ts";
import { provideServerPlayerContextManager } from "../../player/server/context.ts";
import { parseGameSocketEPRequest } from "./common.ts";

export class GameSocketEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) { }

  public async handle({ params, request }: EPContext): Promise<Response> {
    const { token } = parseGameSocketEPRequest(params);

    const data = this.tokenManager.tokens.get(token);
    assertObject(data, 'not-found-token', { status: 404 });
    const { gameId, playerId } = data.identifier;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, 'not-found-game-with-this-token', { status: 404 });
    const { resolver } = gameContext;

    const { response, socket } = Deno.upgradeWebSocket(request);

    const playerContextManager = resolver.resolve(provideServerPlayerContextManager);
    await playerContextManager.createServerPlayerContext({ playerId, socket });

    return response;
  }
}

export function provideSocketGameEPHandler(resolver: ServiceResolver) {
  return new GameSocketEPHandler(
    resolver.resolve(provideServerGameContextManager),
    resolver.resolve(provideTokenManager),
  );
}
