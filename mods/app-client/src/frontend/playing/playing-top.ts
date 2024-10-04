import { div, div_nodes } from "@acme/dom/nodes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { currentPlayerStoreDependency } from "./defs.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { playersStoreDependency } from "../../logic/player/players-store.ts";
import { MapperStore } from "@acme/dom/mapper-store.ts";
import { createSelector, SelectorItem } from "../utils/selector.ts";

const createSelectorItem = ({ color, name, playerId }: PlayerDTO) => ({ key: playerId, name, color });

export function providePlayingTop(resolver: DependencyResolver) {
  const currentPlayerStore = resolver.resolve(currentPlayerStoreDependency);
  const playersStore = resolver.resolve(playersStoreDependency);

  const selectorStore = new MapperStore<PlayerDTO, SelectorItem>(playersStore, createSelectorItem);
  const selector = createSelector(currentPlayerStore, selectorStore);
  selector.moves.on((offset) => currentPlayerStore.add(offset));

  const $label = div("top_label");
  const $root = div_nodes("top _with-controller", [
    $label,
    div_nodes("top_controller", [
      selector.$root,
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
