import { Store } from "../../frontend-framework/store.ts";
import { div_nodes, span_empty, span_text } from "../../frontend-framework/dom.ts";
import { svg_icon } from "../../frontend-framework/svg.ts";
import { onClick } from "./common.ts";

export interface SelectorOption {
  key: string;
  name: string;
}

export function createSelectorOption(option: SelectorOption) {
  const { key, name } = option;
  const content = div_nodes("selector_panel-item", [
    span_empty(`player-cube _${key}`),
    span_text("text", name),
  ]);
  content.dataset.key = key;
  return content;
}

export class SelectorStore extends Store {
  public index = 0;

  public constructor(
    public readonly options: SelectorOption[],
  ) {
    super();
  }

  public setValue(value: string) {
    const index = this.options.findIndex((option) => option.key === value);
    if (index !== -1) {
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

export function createSelector(options: SelectorOption[]) {
  const store = new SelectorStore(options);

  const $left = svg_icon("selector_icon", "arrow-left");
  const $right = svg_icon("selector_icon", "arrow-right");
  const $panel = div_nodes("selector_panel", [
    div_nodes("selector_panel-container", options.map(createSelectorOption)),
  ]);
  const $root = div_nodes("selector", [$left, $panel, $right]);

  store.on(({ index }) => {
    $panel.style.setProperty("--index", `${index}`);
    $left.classList.toggle("_disabled", index === 0);
    $right.classList.toggle("_disabled", index === options.length - 1);
  });

  onClick($left, () => store.dec());
  onClick($right, () => store.inc());

  return { $root, store };
}
