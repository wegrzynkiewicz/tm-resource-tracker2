import { cryptoRandomString } from "../../app-server/deps.ts";
import { defineDependency } from "@acme/dependency/injection.ts";
import { ServerPlayerContextIdentifier } from "../player/server/context.ts";

export interface Token {
  readonly key: string;
  readonly identifier: ServerPlayerContextIdentifier;
}

export class TokenManager {
  public readonly tokens = new Map<string, Token>();

  public createToken(identifier: ServerPlayerContextIdentifier): string {
    const key = cryptoRandomString({ length: 64, type: "url-safe" });
    const token = { key, identifier };
    this.tokens.set(key, token);
    return key;
  }

  public deleteToken(key: string) {
    this.tokens.delete(key);
  }
}

export function provideTokenManager() {
  return new TokenManager();
}
export const tokenManagerDependency = defineDependency({
  kind: "token-manager",
  provider: provideTokenManager,
});
