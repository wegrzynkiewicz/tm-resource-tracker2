import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { NumberStore } from "@acme/dom/number-store.ts";

export function provideCurrentPlayerStore() {
  return new NumberStore();
}

export const currentPlayerStoreDependency = defineDependency({
  name: "current-player-store",
  provider: provideCurrentPlayerStore,
  scope: frontendScopeContract,
});
