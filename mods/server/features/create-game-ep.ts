import { EPRoute, EPHandler } from "../web/endpoint.ts";

export interface CreateGameEPResponse {
  gameId: string;
}

export const createGameEPRoute = new EPRoute("POST", "/game/create");

export class CreateGameEPHandler implements EPHandler {
  public async handle(): Promise<Response> {
    const payload: CreateGameEPResponse = {
      gameId: "game-id",
    };
    const response = Response.json(payload);
    return response;
  }
}

export function provideCreateGameEPHandler() {
  return new CreateGameEPHandler();
}
