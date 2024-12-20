import { ArrayStore } from "@framework/dom/array-store.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { frontendScopeToken } from "../defs.ts";

export function providePlayersStore() {
  return new ArrayStore<PlayerDTO>([]);
}

export const playersStoreDependency = defineDependency({
  provider: providePlayersStore,
  scopeToken: frontendScopeToken,
});
