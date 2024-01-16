import { mapToFragment } from "../common.ts";
import { Channel } from "../common/channel.ts";
import { SVGIcon } from "../common/svg.ts";

interface ToolbarButton {
  key: string;
  icon: string;
  name: string;
}

const buttons: ToolbarButton[] = [
  { key: "supplies", icon: "box", name: "Supplies" },
  { key: "projects", icon: "projects", name: "Projects" },
  { key: "history", icon: "clock", name: "History" },
  { key: "settings", icon: "gear", name: "Settings" },
];

export interface ToolbarButtonClicked {
  key: string;
}

export function createToolbarButton(
  button: ToolbarButton,
  whenClickChannel: Channel<ToolbarButtonClicked>,
) {
  const { key, icon, name } = button;
  const root = (
    <button className="toolbar__item" on:click={() => whenClickChannel.dispatch({ key })}>
      <SVGIcon className="toolbar__icon" icon={icon} />
      <span className="toolbar__label">{name}</span>
    </button>
  );
  return { button, root };
}

export function createToolbar(
  whenClickChannel: Channel<ToolbarButtonClicked>,
) {
  const elements = buttons.map((button) => createToolbarButton(button, whenClickChannel));
  whenClickChannel.subscribers.add(({ key }) => {
    for (const { button, root } of elements) {
      root.classList.toggle("--active", button.key === key);
    }
  });
  return (
    <div className="toolbar">
      {mapToFragment(elements, ({ root }) => root)}
    </div>
  );
}
