import { ServiceResolver } from "../../../common/dependency.ts";
import { provideServerGameContextManager } from "../server/context.ts";
import { ServerGameContextManager } from "../server/context.ts";
import { EPContext, EPHandler } from "../../../common/web/endpoint.ts";
import { provideServerPlayerManager } from "../../player/server/manager.ts";
import { parsePlayerUpdateDTO } from "../../player/common.ts";
import { GameResponse } from "../game.ts";
import { TokenManager, provideTokenManager } from "../../token/manager.ts";

export class CreateGameEPHandler implements EPHandler {
  public constructor(
    public readonly gameContextManager: ServerGameContextManager,
    public readonly tokenManager: TokenManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const body = await request.json();
    const data = parsePlayerUpdateDTO(body);
    const { color, name } = data;
    const isAdmin = true;

    const gameContext = this.gameContextManager.createServerGameContext();
    const { identifier: { gameId }, resolver } = gameContext;

    const playerDataManager = resolver.resolve(provideServerPlayerManager);
    const player = playerDataManager.createPlayer({ color, name, isAdmin });
    const { playerId } = player;

    const token = this.tokenManager.createToken({ gameId, playerId });

    const payload: GameResponse = { gameId, player, token};
    const response = Response.json(payload);
    return response;
  }
}

export function provideCreateGameEPHandler(resolver: ServiceResolver) {
  return new CreateGameEPHandler(
    resolver.resolve(provideServerGameContextManager),
    resolver.resolve(provideTokenManager),
  );
}
