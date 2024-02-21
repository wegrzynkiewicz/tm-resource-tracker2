import { cryptoRandomString } from "../../deps.ts";
import { ServerPlayerContextIdentifier } from "../player/context.ts";

export interface Token {
  readonly key: string;
  readonly identifier: ServerPlayerContextIdentifier;
}

export class TokenManager {
  public readonly tokens = new Map<string, Token>();

  public createToken(identifier: ServerPlayerContextIdentifier): Token {
    const key = cryptoRandomString({ length: 64, type: "url-safe" });
    const token = { key, identifier };
    this.tokens.set(key, token);
    return token;
  }

  public deleteToken(key: string) {
    this.tokens.delete(key);
  }
}

export function provideTokenManager() {
  return new TokenManager();
}
