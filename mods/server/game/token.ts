import { cryptoRandomString } from "../../deps.ts";

export interface Token {
  readonly key: string;
  readonly playerId: number;
  readonly gameId: string;
}

export class TokenManager {
  public readonly tokens = new Map<string, Token>();

  public createToken(playerId: number, gameId: string): Token {
    const key = cryptoRandomString({ length: 64, type: "url-safe" });
    const token = { key, playerId, gameId };
    this.tokens.set(key, token);
    return token;
  }
}

export function provideTokenManager() {
  return new TokenManager();
}
