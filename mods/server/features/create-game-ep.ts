import { assertObject, assertRequiredString } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideServerGameContextManager } from "../game/game.ts";
import { ServerGameContextManager } from "../game/game.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";
import { ReadGameEPResponse } from "./read-game-ep.ts";
import { provideServerPlayerDataManager } from "../player/data.ts";

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
    const isAdmin = true;

    const gameContext = this.manager.createServerGameContext();
    const { identifier: { gameId }, resolver } = gameContext;

    const playerDataManager = resolver.resolve(provideServerPlayerDataManager);
    const playerData = playerDataManager.createPlayerData({ colorKey, name, isAdmin });
    const { playerId, token: { key: token } } = playerData;

    const payload: CreateGameEPResponse = { colorKey, gameId, isAdmin, playerId, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideCreateGameEPHandler(resolver: ServiceResolver) {
  return new CreateGameEPHandler(
    resolver.resolve(provideServerGameContextManager),
  );
}
