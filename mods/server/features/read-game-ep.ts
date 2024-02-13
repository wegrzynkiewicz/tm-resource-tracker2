import { ServiceResolver } from "../../common/dependency.ts";
import { parseAuthorizationToken } from "../useful.ts";
import { EPContext, EPHandler, EPRoute } from "../web/endpoint.ts";
import { ServerPlayerContextResolver, provideServerPlayerContextResolver } from "../player/resolver.ts";

export interface ReadGameEPResponse {
  gameId: string;
  isAdmin: boolean;
  playerId: number;
  token: string;
}

export const readGameEPRoute = new EPRoute("GET", "/games");

export class ReadGameEPHandler implements EPHandler {
  public constructor(
    private resolver: ServerPlayerContextResolver,
  ) { }

  public async handle({ request }: EPContext): Promise<Response> {
    const token = parseAuthorizationToken(request);
    const { gameContext, playerData } = this.resolver.resolvePlayer(token);
    const payload: ReadGameEPResponse = {
      gameId: gameContext.identifier.gameId,
      playerId: playerData.playerId,
      token,
      isAdmin: playerData.isAdmin,
    };
    const response = Response.json(payload);
    return response;
  }
}

export function provideReadGameEPHandler(resolver: ServiceResolver) {
  return new ReadGameEPHandler(
    resolver.resolve(provideServerPlayerContextResolver),
  );
}
