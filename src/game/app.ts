import { Channel } from "../common/channel.ts";
import { div, div_nodes, fragment_nodes } from "../common/dom.ts";
import { ElementSwitcher } from "../common/element-switcher.ts";
import { createProjectsPanel } from "./project.ts";
import { createSuppliesPanel2 } from "./supply.ts";
import { createToolbar, ToolbarButtonClicked } from "./toolbar.ts";
import { createTop } from "./top.ts";

export function createScroll() {
  let content, detectorBottom, detectorTop, root, shadowBottom, shadowTop;
  const fragment = fragment_nodes([
    root = div_nodes("app__main scroll", [
      div_nodes("scroll__container", [
        detectorTop = div("scroll__detector --top"),
        content = div("app__content"),
        detectorBottom = div("scroll__detector --bottom"),
      ]),
    ]),
    shadowTop = div("app__shadow --top"),
    shadowBottom = div("app__shadow --bottom"),
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

  const switcher = new ElementSwitcher(scroll.content);
  switcher.elements.set("supplies", createSuppliesPanel2());
  switcher.elements.set("projects", createProjectsPanel());
  const channel = new Channel<ToolbarButtonClicked>();
  const toolbar = createToolbar(channel);

  channel.subscribers.add(({ key }) => {
    switcher.switch(key);
  });
  channel.dispatch({ key: "supplies" });

  return div_nodes("app --with-toolbar", [
    top,
    scroll.fragment,
    toolbar,
  ]);
}
