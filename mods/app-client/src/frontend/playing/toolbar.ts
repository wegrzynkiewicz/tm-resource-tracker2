import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { PlayingView } from "./playing-view.layout.compiled.ts";
import { button_nodes, span, div_nodes } from "@acme/dom/nodes.ts";
import { svg_icon } from "../utils/svg.ts";
import { controllerRunnerDependency } from "../../controller.ts";
import { createPlayingPath } from "../routes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { controllerScopeContract } from "../../../defs.ts";
import { Channel } from "@acme/dependency/channel.ts";

const buttons = [
  { view: "supplies", icon: "box", name: "Supplies" },
  { view: "projects", icon: "projects", name: "Projects" },
  { view: "histories", icon: "clock", name: "History" },
  { view: "settings", icon: "gear", name: "Settings" },
] as const;

interface ToolbarButton {
  view: PlayingView;
  icon: string;
  name: string;
}

export function provideToolbar(resolver: DependencyResolver) {
  const controllerRunner = resolver.resolve(controllerRunnerDependency);

  const refresh = new Channel<[]>();

  const createToolbarButton = (button: ToolbarButton) => {
    const { view, icon, name } = button;
    const $item = button_nodes("toolbar_item", [
      svg_icon("toolbar_icon", icon),
      span("toolbar_label", name),
    ]);
    $item.addEventListener("click", () => {
      controllerRunner.run(createPlayingPath(view));
      refresh.emit();
      $item.classList.add("_active");
    });
    refresh.on(() => {
      $item.classList.remove("_active");
    });
    return $item;
  }

  const $root = div_nodes("toolbar", buttons.map(createToolbarButton));

  return { $root };
}

export const toolbarDependency = defineDependency({
  name: "toolbar",
  provider: provideToolbar,
  scope: controllerScopeContract,
});
