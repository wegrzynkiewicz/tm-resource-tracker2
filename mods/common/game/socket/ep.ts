import { assertObject } from "../../../core/asserts.ts";
import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { EPContext, EPHandler } from "../../../core/web/endpoint.ts";
import { provideServerGameContextManager, ServerGameContextManager } from "../server/context.ts";
import { provideTokenManager, TokenManager } from "../../token/manager.ts";
import { provideServerPlayerContextManager } from "../../player/server/context.ts";
import { parseGameSocketEPRequest } from "./common.ts";

export class GameSocketEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
    protected readonly tokenManager: TokenManager,
  ) {}

  public async handle({ params, request }: EPContext): Promise<Response> {
    const { token } = parseGameSocketEPRequest(params);

    const data = this.tokenManager.tokens.get(token);
    assertObject(data, "not-found-token", { status: 404 });
    const { gameId, playerId } = data.identifier;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, "not-found-game-with-this-token", { status: 404 });
    const { resolver } = gameContext;

    const { response, socket } = Deno.upgradeWebSocket(request);

    const playerContextManager = resolver.resolve(serverPlayerContextManagerDependency);
    await playerContextManager.createServerPlayerContext({ playerId, socket });

    return response;
  }
}

export function provideSocketGameEPHandler(resolver: DependencyResolver) {
  return new GameSocketEPHandler(
    resolver.resolve(serverGameContextManagerDependency),
    resolver.resolve(tokenManagerDependency),
  );
}
