import { EPRoute, EPHandler } from "../web/endpoint.ts";

export interface ReadGameEPResponse {
  gameId: string;
}

export const readGameEPRoute = new EPRoute("GET", "/games");

export class ReadGameEPHandler implements EPHandler {
  public async handle(): Promise<Response> {
    const gameId = "12";
    const payload: ReadGameEPResponse = {
      gameId,
    };
    const response = Response.json(payload);
    return response;
  }
}

export function provideReadGameEPHandler() {
  return new ReadGameEPHandler();
}
