import { Channel } from "../common/store.ts";
import { button_nodes, div_nodes, span_text } from "../common/dom.ts";
import { svg_icon } from "../common/svg.ts";

interface ToolbarButton {
  key: string;
  icon: string;
  name: string;
}

const buttons: ToolbarButton[] = [
  { key: "supplies", icon: "box", name: "Supplies" },
  { key: "projects", icon: "projects", name: "Projects" },
  { key: "histories", icon: "clock", name: "History" },
  { key: "settings", icon: "gear", name: "Settings" },
];

export interface ToolbarButtonClicked {
  key: string;
}

export const toolbarClickChannel = new Channel<ToolbarButtonClicked>();

export function createToolbarButton(button: ToolbarButton) {
  const { key, icon, name } = button;
  const root = button_nodes("toolbar_item", [
    svg_icon("toolbar_icon", icon),
    span_text("toolbar_label", name),
  ]);
  root.addEventListener("click", () => {
    toolbarClickChannel.dispatch({ key });
  });
  toolbarClickChannel.subscribers.add(({ key }) => {
    root.classList.toggle("_active", button.key === key);
  });
  return root;
}

export function createToolbar() {
  return div_nodes("toolbar", buttons.map(createToolbarButton));
}
