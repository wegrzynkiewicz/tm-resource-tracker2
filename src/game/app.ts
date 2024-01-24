import { div_empty, div_text, div_nodes, fragment_nodes } from "../common/dom.ts";
import { ElementSwitcher } from "../common/element-switcher.ts";
import { createHistoriesPanel, examples, historyEntryCreatedChannel } from "./history.ts";
import { modalManager } from "./modal.ts";
import { createProjectsPanel } from "./project.ts";
import { createSettings } from "./settings.ts";
import { createSuppliesPanel } from "./supply.ts";
import { toolbarClickChannel } from "./toolbar.ts";
import { createToolbar } from "./toolbar.ts";
import { createTop } from "./top.ts";

export function createQuestion() {
  return div_nodes("app_content-overlay", [
    div_nodes("modal", [
      div_nodes("modal_background", [
        div_nodes("modal_container", [
          div_text('modal_title', "Do you want to quit the game?"),
          div_nodes('modal_buttons', [
            div_text('box _button', 'Cancel'),
            div_text('box _button', 'Confirm'),
          ]),
        ]),
      ]),
    ]),
  ]);
}

export function createScroll() {
  let content, detectorBottom, detectorTop, root, shadowBottom, shadowTop;
  const fragment = fragment_nodes([
    root = div_nodes("app_main scroll", [
      div_nodes("scroll_container", [
        detectorTop = div_empty("scroll_detector _top"),
        content = div_empty("app_content"),
        detectorBottom = div_empty("scroll_detector _bottom"),
      ]),
    ]),
    shadowTop = div_empty("app_shadow _top"),
    shadowBottom = div_empty("app_shadow _bottom"),
  ]);

  const map = new WeakMap<Element, Element>([
    [detectorTop, shadowTop],
    [detectorBottom, shadowBottom],
  ]);

  const callback = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const target = entry.target as Element;
      const shadow = map.get(target)!;
      shadow.classList.toggle(`_enabled`, !entry.isIntersecting);
    }
  };
  const options = {
    root,
    threshold: [1.0],
  };
  const observer = new IntersectionObserver(callback, options);

  observer.observe(detectorTop);
  observer.observe(detectorBottom);

  return { fragment, content };
}

export function createApp() {
  const top = createTop();
  const scroll = createScroll();
  const toolbar = createToolbar();

  const switcher = new ElementSwitcher(scroll.content);
  switcher.elements.set("supplies", createSuppliesPanel());
  switcher.elements.set("projects", createProjectsPanel());
  switcher.elements.set("histories", createHistoriesPanel());
  switcher.elements.set("settings", createSettings());

  historyEntryCreatedChannel.dispatch(examples[0]);
  historyEntryCreatedChannel.dispatch(examples[1]);
  historyEntryCreatedChannel.dispatch(examples[2]);
  historyEntryCreatedChannel.dispatch(examples[3]);

  toolbarClickChannel.subscribers.add(({ key }) => {
    switcher.switch(key);
  });
  toolbarClickChannel.dispatch({ key: "supplies" });

  return div_nodes("app _with-toolbar", [
    top,
    scroll.fragment,
    modalManager.root,
    toolbar,
  ]);
}
