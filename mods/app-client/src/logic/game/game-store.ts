import { defineDependency } from "@acme/dependency/declaration.ts";
import { clientGameScopeContract } from "../../../defs.ts";
import { deferred } from "@acme/useful/async.ts";

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
  name: "game-store",
  provider: provideGameStore,
  scope: clientGameScopeContract,
});
