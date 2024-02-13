import { assertObject, assertRequiredString } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideServerGameContextManager } from "../game/game.ts";
import { ServerGameContextManager } from "../game/game.ts";
import { provideServerPlayerContextManager } from "../player/context.ts";
import { providePlayerData } from "../player/data.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";
import { ReadGameEPResponse } from "./read-game-ep.ts";

export interface CreateGameEPRequest {
  colorKey: string;
  name: string;
}

export type CreateGameEPResponse = ReadGameEPResponse

export function parseCreateGameEPRequest(data: unknown): CreateGameEPRequest {
  assertObject<CreateGameEPRequest>(data, 'payload-must-be-object');
  const { colorKey, name } = data;
  assertRequiredString(colorKey, 'color-must-be-required-string');
  assertRequiredString(name, 'name-must-be-required-string');
  return { colorKey, name };
}

export const createGameEPRoute = new EPRoute("POST", "/games");

export class CreateGameEPHandler implements EPHandler {
  public constructor(
    public readonly manager: ServerGameContextManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const body = await request.json();
    const data = parseCreateGameEPRequest(body);
    const { colorKey, name } = data;

    const gameContext = this.manager.createServerGameContext();
    const playerManager = gameContext.resolver.resolve(provideServerPlayerContextManager);

    const playerContext = playerManager.createServerPlayerContext({ colorKey, name, isAdmin: true });
    const player = playerContext.resolver.resolve(providePlayerData);

    const payload: CreateGameEPResponse = {
      gameId: gameContext.identifier.gameId,
      isAdmin: player.isAdmin,
      playerId: player.playerId,
      token: player.token.key,
    };
    const response = Response.json(payload);
    return response;
  }
}

export function provideCreateGameEPHandler(resolver: ServiceResolver) {
  return new CreateGameEPHandler(
    resolver.resolve(provideServerGameContextManager),
  );
}
