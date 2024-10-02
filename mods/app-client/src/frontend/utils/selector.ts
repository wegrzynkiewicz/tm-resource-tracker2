import { Channel } from "@acme/dependency/channel.ts";
import { svg_icon } from "./svg.ts";
import { div_nodes, input, span } from "@acme/dom/nodes.ts";
import { clamp } from "../app/panel.ts";

export interface SelectorOption {
  readonly key: string;
  readonly name: string;
}

export class SelectorStore {
  public index = 0;
  public readonly updates = new Channel<[number]>();

  public constructor(
    public readonly options: SelectorOption[],
  ) {}

  public setIndex(index: number) {
    this.index = clamp(index, 0, this.options.length - 1);
    this.updates.emit(this.index);
  }

  public getValue(): SelectorOption {
    return this.options[this.index];
  }

  public dec() {
    this.setIndex(this.index - 1);
  }

  public inc() {
    this.setIndex(this.index + 1);
  }
}

export function createSelectorOption(option: SelectorOption) {
  const { key, name } = option;
  const $content = div_nodes("selector_panel-item", [
    span(`player-cube _${key}`),
    span("text", name),
  ]);
  $content.dataset.key = key;
  return $content;
}

export function createSelector(
  name: string,
  store: SelectorStore,
) {
  const $left = svg_icon("selector_icon", "arrow-left");
  $left.addEventListener("click", () => store.dec());

  const $right = svg_icon("selector_icon", "arrow-right");
  $right.addEventListener("click", () => store.inc());

  const $panel = div_nodes("selector_panel", [
    div_nodes("selector_panel-container", store.options.map(createSelectorOption)),
  ]);
  const $input = input("selector_input");
  $input.name = name;
  $input.type = "hidden";

  const $root = div_nodes("selector", [$left, $panel, $input, $right]);

  store.updates.on((index) => {
    $input.value = store.getValue().key;
    $panel.style.setProperty("--index", `${index}`);
    $left.classList.toggle("_disabled", index === 0);
    $right.classList.toggle("_disabled", index === store.options.length - 1);
  });

  return $root;
}
