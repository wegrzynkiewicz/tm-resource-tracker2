import { defineDependency } from "@framework/dependency/declaration.ts";
import { clientGameScopeToken } from "../defs.ts";
import { deferred } from "@framework/useful/async.ts";

export class GameStore {
  private readonly defer = deferred<void>();

  public sync() {
    this.defer.resolve();
  }

  public get ready() {
    return this.defer.promise;
  }
}

export function provideGameStore() {
  return new GameStore();
}

export const gameStoreDependency = defineDependency({
  provider: provideGameStore,
  scopeToken: clientGameScopeToken,
});
