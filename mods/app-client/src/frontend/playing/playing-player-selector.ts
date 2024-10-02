import { defineDependency } from '@acme/dependency/declaration.ts';
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { SelectorOption, SelectorStore } from "../utils/selector.ts";
import { playersStoreDependency } from "../../logic/player/players-store.ts";
import { frontendScopeContract } from "../../../defs.ts";

export function providePlayingPlayerSelectorStore(resolver: DependencyResolver) {
  const store = resolver.resolve(playersStoreDependency);
  const options: SelectorOption[] = [];
  for (const { color, name } of store.players) {
    options.push({ key: color, name });
  }
  return new SelectorStore(options);
}

export const playingPlayerSelectorStoreDependency = defineDependency({
  name: "playing-player-selector-store",
  provider: providePlayingPlayerSelectorStore,
  scope: frontendScopeContract,
});
