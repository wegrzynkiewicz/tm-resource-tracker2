import { createRandomStringFactory } from "@framework/useful/strings.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { globalScopeToken } from "@framework/dependency/scopes.ts";

export interface TokenTarget {
  readonly gameId: string;
  readonly playerId: string;
}

export interface Token {
  readonly key: string;
  readonly identifier: TokenTarget;
}

const randomKey = createRandomStringFactory(64);

export class TokenManager {
  public readonly tokens = new Map<string, Token>();

  public createToken(identifier: TokenTarget): string {
    const key = randomKey();
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
  provider: provideTokenManager,
  scopeToken: globalScopeToken,
});
