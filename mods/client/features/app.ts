import { div_empty, div_text, div_nodes, fragment_nodes } from "../../frontend-framework/dom.ts";
import { ElementSwitcher } from "../../frontend-framework/element-switcher.ts";
import { Channel } from "../../frontend-framework/store.ts";
import { createHistoriesPanel, examples, historyEntryCreatedChannel } from "../features/history.ts";
import { createHomepage } from "./homepage/homepage.ts";
import { modalManager } from "../features/modal.ts";
import { createProjectsPanel } from "../features/project.ts";
import { createSettings } from "../features/settings.ts";
import { createSuppliesPanel } from "../features/supply.ts";
import { toolbarClickChannel } from "../features/toolbar.ts";
import { createToolbar } from "../features/toolbar.ts";
import { createTop } from "../features/top.ts";

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

export const appState = new Channel<"homepage" | "work">();

export function createApp() {
  const top = createTop();
  const scroll = createScroll();
  const $toolbar = createToolbar();

  const switcher = new ElementSwitcher(scroll.content);
  switcher.elements.set("homepage", createHomepage());
  switcher.elements.set("supplies", createSuppliesPanel());
  switcher.elements.set("projects", createProjectsPanel());
  switcher.elements.set("histories", createHistoriesPanel());
  switcher.elements.set("settings", createSettings());

  historyEntryCreatedChannel.emit(examples[0]);
  historyEntryCreatedChannel.emit(examples[1]);
  historyEntryCreatedChannel.emit(examples[2]);
  historyEntryCreatedChannel.emit(examples[3]);

  toolbarClickChannel.on(({ key }) => {
    switcher.switch(key);
  });

  const $root = div_nodes("app", [
    top,
    scroll.fragment,
    modalManager.root,
    $toolbar,
  ]);

  appState.on((state) => {
    if (state === "homepage") {
      $root.classList.remove('_with-toolbar');
      $toolbar.classList.add('_hidden');
      toolbarClickChannel.emit({ key: "homepage" });
    } else if (state === "work") {
      $root.classList.add('_with-toolbar');
      $toolbar.classList.remove('_hidden');
      toolbarClickChannel.emit({ key: "settings" });
    }
  });
  appState.emit("homepage");

  return $root;
}
