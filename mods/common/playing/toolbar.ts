import { DependencyResolver } from "@acme/dependency/service-resolver.ts";

const buttons = [
  { key: "supplies", icon: "box", name: "Supplies" },
  { key: "projects", icon: "projects", name: "Projects" },
  { key: "histories", icon: "clock", name: "History" },
  { key: "settings", icon: "gear", name: "Settings" },
] as const;

export type ToolbarKey = typeof buttons[number]["key"];

interface ToolbarButton {
  key: ToolbarKey;
  icon: string;
  name: string;
}

export function provideToolbarSwitcher() {
  return new Signal<ToolbarKey>("supplies");
}

export class ToolbarView {
  public readonly $root: HTMLDivElement;
  public constructor(
    public readonly signal: Signal<ToolbarKey>,
  ) {
    this.$root = div_nodes("toolbar", buttons.map((btn) => this.createToolbarButton(btn)));
  }

  public createToolbarButton(button: ToolbarButton) {
    const { key, icon, name } = button;
    const $button = button_nodes("toolbar_item", [
      svg_icon("toolbar_icon", icon),
      span("toolbar_label", name),
    ]);
    $button.addEventListener("click", () => {
      this.signal.update(key);
    });
    this.signal.on((key) => {
      $button.classList.toggle("_active", button.key === key);
    });
    return $button;
  }

  public show() {
    this.$root.classList.remove("_hidden");
  }

  public hide() {
    this.$root.classList.add("_hidden");
  }
}

export function provideToolbarView(resolver: DependencyResolver) {
  return new ToolbarView(
    resolver.resolve(toolbarSwitcherDependency),
  );
}
