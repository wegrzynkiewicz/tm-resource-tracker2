import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { PlayingView } from "./playing-view.layout.compiled.ts";
import { button_nodes, div_nodes, span } from "@acme/dom/nodes.ts";
import { svg_icon } from "../utils/svg.ts";
import { controllerRunnerDependency } from "../../controller.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { playingPathFactory } from "../routes.ts";
import { playingViewStoreDependency } from "./defs.ts";

const buttons = [
  { view: "resources", icon: "box", name: "Resources" },
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
  const playingViewStore = resolver.resolve(playingViewStoreDependency);

  const createToolbarButton = (button: ToolbarButton) => {
    const { view, icon, name } = button;
    const $item = button_nodes("toolbar_item", [
      svg_icon("toolbar_icon", icon),
      span("toolbar_label", name),
    ]);
    $item.addEventListener("click", () => {
      controllerRunner.run(playingPathFactory(view));
    });
    const update = () => $item.classList.toggle("_active", playingViewStore.view === view);
    playingViewStore.updates.on(update);
    update();
    return $item;
  };

  const $root = div_nodes("toolbar", buttons.map(createToolbarButton));

  return { $root };
}

export const toolbarDependency = defineDependency({
  provider: provideToolbar,
  scope: frontendScopeContract,
});
