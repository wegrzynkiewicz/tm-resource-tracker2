import { div_text, div_nodes } from "../../../frontend-framework/dom.ts";
import { ElementSwitcher } from "../../../frontend-framework/element-switcher.ts";
import { Channel } from "../../../frontend-framework/store.ts";
import { createHistoriesPanel, examples, historyEntryCreatedChannel } from "../history.ts";
import { modalManager } from "../modal.ts";
import { createProjectsPanel } from "../project.ts";
import { createSettings } from "../settings.ts";
import { createSuppliesPanel } from "../supply.ts";
import { toolbarClickChannel } from "../toolbar.ts";
import { createToolbar } from "../toolbar.ts";
import { createTop } from "../top.ts";
import { HomepageView } from "../homepage/homepage.ts";
import { WaitingView } from "../waiting/waiting.ts";
import { createScroll } from "./scroll.ts";

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

export const appState = new Channel<"homepage" | "work">();

export class AppView {
  public readonly $root: HTMLDivElement;
  public constructor() {
    const top = createTop();
    const scroll = createScroll();
    const $toolbar = createToolbar();
  
    const switcher = new ElementSwitcher(scroll.$content);
    switcher.elements.set("waiting", new WaitingView().$root);
    switcher.elements.set("homepage", new HomepageView().$root);
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
  
    this.$root = div_nodes("app", [
      top,
      scroll.$fragment,
      modalManager.root,
      $toolbar,
    ]);
  
    appState.on((state) => {
      if (state === "homepage") {
        this.$root.classList.remove('_with-toolbar');
        $toolbar.classList.add('_hidden');
        toolbarClickChannel.emit({ key: "homepage" });
      } else if (state === "work") {
        this.$root.classList.add('_with-toolbar');
        $toolbar.classList.remove('_hidden');
        toolbarClickChannel.emit({ key: "settings" });
      }
    });
    appState.emit("homepage");
  }
}

export function provideAppView() {
  return new AppView();
}
