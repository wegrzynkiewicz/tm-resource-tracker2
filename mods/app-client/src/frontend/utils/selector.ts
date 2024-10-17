import { Channel } from "@acme/dom/channel.ts";
import { svg_icon } from "./svg.ts";
import { div, div_nodes, span } from "@acme/dom/nodes.ts";
import { NumberStore } from "@acme/dom/number-store.ts";
import { IterableStore } from "@acme/dom/defs.ts";

export function createSelectorOption(item: SelectorItem) {
  const $content = div_nodes("selector_panel-item", [
    span(`player-cube _${item.color}`),
    span("text", item.name),
  ]);
  $content.dataset.key = item.key;
  return $content;
}

export interface SelectorItem {
  key: string;
  color: string;
  name: string;
}

export function createSelector(
  indexStore: NumberStore,
  itemsStore: IterableStore<SelectorItem>,
) {
  const moves = new Channel<[number]>();

  let leftEnabled = true;
  let rightEnabled = true;

  const $left = svg_icon("selector_icon", "arrow-left");
  $left.addEventListener("click", () => leftEnabled && moves.emit(-1));

  const $right = svg_icon("selector_icon", "arrow-right");
  $right.addEventListener("click", () => rightEnabled && moves.emit(1));

  const $container = div("selector_panel-container");
  const $panel = div_nodes("selector_panel", [$container]);
  const $root = div_nodes("selector", [$left, $panel, $right]);

  const updateItems = () => {
    $container.replaceChildren(...itemsStore.items.map(createSelectorOption));
  };
  itemsStore.updates.on(updateItems);
  updateItems();

  const updateIndex = () => {
    const { value } = indexStore;
    $panel.style.setProperty("--index", `${value}`);
    leftEnabled = value > 0;
    rightEnabled = value < itemsStore.length - 1;
    $left.classList.toggle("_disabled", leftEnabled === false);
    $right.classList.toggle("_disabled", rightEnabled === false);
  };
  indexStore.updates.on(updateIndex);
  updateIndex();

  const getValue = (): SelectorItem | undefined => {
    return itemsStore.items[indexStore.value];
  };

  const dispose = () => {
    itemsStore.updates.off(updateItems);
    indexStore.updates.off(updateIndex);
  }

  return { $root, dispose, getValue, moves };
}
