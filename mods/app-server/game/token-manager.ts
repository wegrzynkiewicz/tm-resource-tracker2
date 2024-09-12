import { cryptoRandomString } from "../../app-server/deps.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { ServerPlayerScopeIdentifier } from "../defs.ts";
import { globalScopeContract } from "@acme/dependency/scopes.ts";

export interface Token {
  readonly key: string;
  readonly identifier: ServerPlayerScopeIdentifier;
}

export class TokenManager {
  public readonly tokens = new Map<string, Token>();

  public createToken(identifier: ServerPlayerScopeIdentifier): string {
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
  name: "token-manager",
  provider: provideTokenManager,
  scope: globalScopeContract,
});
