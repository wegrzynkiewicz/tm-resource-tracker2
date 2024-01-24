import { mapToFragment } from "../common.ts";
import { Channel } from "../common/channel.ts";
import { button_text, div_empty, div_text, div_nodes, fragment_nodes, img_props, span_text } from "../common/dom.ts";
import { ElementSwitcher } from "../common/element-switcher.ts";
import { createHistoriesPanel, examples, historyEntryCreatedChannel } from "./history.ts";
import { createProjectsPanel } from "./project.ts";
import { createSettings } from "./settings.ts";
import { createSupplyModal } from "./supply-modal.ts";
import { createSuppliesPanel } from "./supply.ts";
import { toolbarClickChannel } from "./toolbar.ts";
import { createToolbar } from "./toolbar.ts";
import { createTop } from "./top.ts";

export function createQuestion() {
  return div_nodes("app__content-overlay", [
    div_nodes("modal", [
      div_nodes("modal__background", [
        div_nodes("modal__container", [
          div_text('modal__title', "Do you want to quit the game?"),
          div_nodes('modal__buttons', [
            div_text('box --button', 'Cancel'),
            div_text('box --button', 'Confirm'),
          ]),
        ]),
      ]),
    ]),
  ]);
}

export function createScroll() {
  let content, detectorBottom, detectorTop, root, shadowBottom, shadowTop;
  const fragment = fragment_nodes([
    root = div_nodes("app__main scroll", [
      div_nodes("scroll__container", [
        detectorTop = div_empty("scroll__detector --top"),
        content = div_empty("app__content"),
        detectorBottom = div_empty("scroll__detector --bottom"),
      ]),
    ]),
    shadowTop = div_empty("app__shadow --top"),
    shadowBottom = div_empty("app__shadow --bottom"),
    createSupplyModal({
      count: 15,
      target: "production",
      type: 'gold',
    }).root,
  ]);

  const map = new WeakMap<Element, Element>([
    [detectorTop, shadowTop],
    [detectorBottom, shadowBottom],
  ]);

  const callback = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const target = entry.target as Element;
      const shadow = map.get(target)!;
      shadow.classList.toggle(`--enabled`, !entry.isIntersecting);
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

  return div_nodes("app --with-toolbar", [
    top,
    scroll.fragment,
    toolbar,
  ]);
}
