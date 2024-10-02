import { div, div_nodes } from "@acme/dom/nodes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { createSelector } from "../utils/selector.ts";
import { playingPlayerSelectorStoreDependency } from "./playing-player-selector.ts";

export function providePlayingTop(resolver: DependencyResolver) {
  const store = resolver.resolve(playingPlayerSelectorStoreDependency);
  const $label = div("top_label");
  const $root = div_nodes("top _with-controller", [
    $label,
    div_nodes("top_controller", [
      createSelector("player", store),
    ]),
  ]);
  const updateTitle = (title: string) => $label.textContent = title;

  return { $root, updateTitle };
}

export const playingTopDependency = defineDependency({
  name: "playing-top",
  provider: providePlayingTop,
  scope: frontendScopeContract,
});
