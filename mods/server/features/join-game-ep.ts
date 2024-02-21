import { assertObject, assertRequiredString } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { ServerGameContextManager, provideServerGameContextManager } from "../game/game.ts";
import { provideServerPlayerDataManager } from "../player/data.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";
import { ReadGameEPResponse } from "./read-game-ep.ts";

export interface JoinGameEPRequest {
  colorKey: string;
  gameId: string;
  name: string;
}

export type JoinGameEPResponse = ReadGameEPResponse

export function parseJoinGameEPRequest(data: unknown): JoinGameEPRequest {
  assertObject<JoinGameEPRequest>(data, 'payload-must-be-object');
  const { colorKey, name, gameId } = data;
  assertRequiredString(colorKey, 'color-must-be-required-string');
  assertRequiredString(gameId, 'game-id-must-be-required-string');
  assertRequiredString(name, 'name-must-be-required-string');
  return { colorKey, name, gameId };
}

export const joinGameEPRoute = new EPRoute("POST", "/games/join");

export class JoinGameEPHandler implements EPHandler {
  public constructor(
    protected readonly gameManager: ServerGameContextManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const body = await request.json();
    const data = parseJoinGameEPRequest(body);
    const { colorKey, gameId, name } = data;
    const isAdmin = false;

    const gameContext = this.gameManager.games.get(gameId);
    assertObject(gameContext, 'not-found-game-with-this-token', { status: 404 });
    const { resolver } = gameContext;

    const playerDataManager = resolver.resolve(provideServerPlayerDataManager);
    const playerData = playerDataManager.createPlayerData({ colorKey, name, isAdmin });
    const { playerId, token: { key: token } } = playerData;

    const payload: JoinGameEPResponse = { colorKey, gameId, name, isAdmin, playerId, token };
    const response = Response.json(payload);
    return response;
  }
}

export function provideJoinGameEPHandler(resolver: ServiceResolver) {
  return new JoinGameEPHandler(
    resolver.resolve(provideServerGameContextManager),
  );
}
