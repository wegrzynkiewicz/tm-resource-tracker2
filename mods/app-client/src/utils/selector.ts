import { Store } from "../../../core/frontend-framework/store.ts";
import { svg_icon } from "./svg.ts";
import { div_nodes, input, span } from "@acme/dom/nodes.ts";

export interface SelectorOption {
  readonly key: string;
  readonly name: string;
}

export class SelectorStore extends Store {
  public index = 0;

  public constructor(
    public readonly options: SelectorOption[],
  ) {
    super();
  }

  public setIndex(index: number) {
    if (index >= 0 && index < this.options.length) {
      this.index = index;
      this.emit();
    }
  }

  public getValue(): SelectorOption {
    return this.options[this.index];
  }

  public dec() {
    if (this.index > 0) {
      this.index -= 1;
      this.emit();
    }
  }

  public inc() {
    if (this.index < this.options.length - 1) {
      this.index += 1;
      this.emit();
    }
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

  store.on(({ index }) => {
    $input.value = store.getValue().key;
    $panel.style.setProperty("--index", `${index}`);
    $left.classList.toggle("_disabled", index === 0);
    $right.classList.toggle("_disabled", index === store.options.length - 1);
  });

  return $root;
}
