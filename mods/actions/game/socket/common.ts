import { assertObject, assertRequiredString } from "../../../common/asserts.ts";
import { EPRoute } from "../../../common/web/endpoint.ts";

export interface GameSocketEPParams {
  token: string;
}

export function parseGameSocketEPRequest(value: unknown): GameSocketEPParams {
  assertObject<GameSocketEPParams>(value, "player-web-socket-params-must-be-object");
  const { token } = value;
  assertRequiredString(token, "player-web-socket-params-token-must-be-string");
  return { token };
}

export const socketGameEPRoute = new EPRoute("GET", "/games/socket/:token");
