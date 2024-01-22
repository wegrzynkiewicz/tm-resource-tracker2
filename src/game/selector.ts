import { mapToFragment } from "../common.ts";
import { Channel } from "../common/channel.ts";
import { div_nodes, span_props, span_text } from "../common/dom.ts";
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
  const content = div_nodes("selector__panel-item", [
    span_props({ className: "player-cube", style: `--background: var(--color-player-cube-${color})` }),
    span_text("text", name),
  ]);
  content.dataset.key = key;
  return content;
};

export interface SelectorSelected {
  index: number;
  key: string;
}

export class SelectorController {
  public currentIndex = 0;
  public readonly channel = new Channel<SelectorSelected>();

  public constructor(
    public readonly options: SelectorOption[]
  ) { }

  public setCurrent(index: number) {
    const { key } = this.options[index];
    this.currentIndex = index;
    this.channel.dispatch({ index, key });
  }

  public dec() {
    if (this.currentIndex > 0) {
      this.setCurrent(this.currentIndex - 1);
    }
  }

  public inc() {
    if (this.currentIndex < this.options.length - 1) {
      this.setCurrent(this.currentIndex + 1);
    }
  }
}

export function createSelector(options: SelectorOption[]) {
  const controller = new SelectorController(options);

  const left = svg_icon("selector__icon", "arrow-left");
  const right = svg_icon("selector__icon", "arrow-right");
  const panel = div_nodes("selector__panel", [
    div_nodes('selector__panel-container', [
      mapToFragment(options, createSelectorOption),
    ]),
  ]);
  const root = div_nodes("selector", [left, panel, right]);

  controller.channel.subscribers.add(({ index }) => {
    panel.style.setProperty("--index", `${index}`);
    left.classList.toggle("--disabled", index === 0);
    right.classList.toggle("--disabled", index === options.length - 1);
  });
  controller.setCurrent(0);

  left.addEventListener("click", () => controller.dec());
  right.addEventListener("click", () => controller.inc());

  return { controller, root };
}
