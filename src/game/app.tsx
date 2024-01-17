import { Channel } from "../common/channel.ts";
import { ElementSwitcher } from "../common/element-switcher.ts";
import { createProjectsPanel } from "./project.tsx";
import { createSuppliesPanel } from "./supply.tsx";
import { createToolbar, ToolbarButtonClicked } from "./toolbar.tsx";
import { createTop } from "./top.tsx";

export function createScroll() {
  const detectorTop = <div data-detector="top"></div>;
  const content = <div class="app__content"></div>;
  const detectorBottom = <div data-detector="bottom"></div>;

  const root = (
    <div class="app__main scroll">
      <div class="scroll__container">
        {detectorTop}
        {content}
        {detectorBottom}
      </div>
    </div>
  );

  const shadowTop = <div class="app__shadow --top"></div>;
  const shadowBottom = <div class="app__shadow --bottom"></div>;

  const fragment = (
    <>
      {root}
      {shadowTop}
      {shadowBottom}
    </>
  );

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
  switcher.elements.set("projects", createProjectsPanel());
  switcher.elements.set("supplies", createSuppliesPanel());
  const channel = new Channel<ToolbarButtonClicked>();
  const toolbar = createToolbar(channel);

  channel.subscribers.add(({ key }) => {
    switcher.switch(key);
  });
  channel.dispatch({ key: "supplies" });

  return (
    <div id="app" class="app --with-toolbar">
      {top}
      {scroll.fragment}
      {toolbar}
    </div>
  );
}
