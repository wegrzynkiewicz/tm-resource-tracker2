import { Store } from "../common/store.ts";
import { div_nodes, span_empty, span_text } from "../common/dom.ts";
import { svg_icon } from "../common/svg.ts";

export interface SelectorOption {
  color: string;
  key: string;
  name: string;
}

export const colors: SelectorOption[] = [
  { color: "green", key: "green", name: "Green" },
  { color: "red", key: "red", name: "Red" },
  { color: "blue", key: "blue", name: "Blue" },
  { color: "yellow", key: "yellow", name: "Yellow" },
  { color: "black", key: "black", name: "Black" },
];

export function createSelectorOption(option: SelectorOption) {
  const { color, key, name } = option;
  const content = div_nodes("selector_panel-item", [
    span_empty(`player-cube _${color}`),
    span_text("text", name),
  ]);
  content.dataset.key = key;
  return content;
};

export interface SelectorSelected {
  index: number;
  key: string;
}

export class SelectorStore extends Store {
  public index = 0;

  public constructor(
    public readonly options: SelectorOption[]
  ) { 
    super();
  }

  public dec() {
    if (this.index > 0) {
      this.index -= 1;
      this.update();
    }
  }

  public inc() {
    if (this.index < this.options.length - 1) {
      this.index += 1;
      this.update();
    }
  }
}

export function createSelector(options: SelectorOption[]) {
  const store = new SelectorStore(options);

  const left = svg_icon("selector_icon", "arrow-left");
  const right = svg_icon("selector_icon", "arrow-right");
  const panel = div_nodes("selector_panel", [
    div_nodes('selector_panel-container', options.map(createSelectorOption)),
  ]);
  const root = div_nodes("selector", [left, panel, right]);

  store.updates.on(({ index }) => {
    panel.style.setProperty("--index", `${index}`);
    left.classList.toggle("_disabled", index === 0);
    right.classList.toggle("_disabled", index === options.length - 1);
  });
  store.update();

  left.addEventListener("click", () => store.dec());
  right.addEventListener("click", () => store.inc());

  return { root, store };
}
