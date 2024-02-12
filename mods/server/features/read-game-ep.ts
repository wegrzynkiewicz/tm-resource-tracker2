import { ServiceResolver } from "../../common/dependency.ts";
import { provideTokenManager, TokenManager } from "../game/token.ts";
import { EPHandler, EPRoute } from "../web/endpoint.ts";

export interface ReadGameEPResponse {
  gameId: string;
}

export const readGameEPRoute = new EPRoute("GET", "/games");

export class ReadGameEPHandler implements EPHandler {
  public constructor(
    private tokenManager: TokenManager,
  ) {}

  public async handle(): Promise<Response> {
    const gameId = "12";
    const payload: ReadGameEPResponse = {
      gameId,
    };
    const response = Response.json(payload);
    return response;
  }
}

export function provideReadGameEPHandler(resolver: ServiceResolver) {
  return new ReadGameEPHandler(
    resolver.resolve(provideTokenManager),
  );
}
