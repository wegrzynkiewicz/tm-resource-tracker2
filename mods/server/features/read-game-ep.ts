import { assertNonNull, assertObject } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideTokenManager, TokenManager } from "../game/token.ts";
import { parseAuthorizationToken } from "../useful.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";

export interface ReadGameEPResponse {
  gameId: string;
}

export const readGameEPRoute = new EPRoute("GET", "/games");

export class ReadGameEPHandler implements EPHandler {
  public constructor(
    private tokenManager: TokenManager,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const token = parseAuthorizationToken(request);
    const data = this.tokenManager.tokens.get(token);
    assertObject(data, 'not-found-game-with-this-token', { status: 404 });

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
