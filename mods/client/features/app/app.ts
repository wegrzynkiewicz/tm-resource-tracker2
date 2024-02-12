import { div_nodes, div_text } from "../../../frontend-framework/dom.ts";
import { ElementSwitcher } from "../../../frontend-framework/element-switcher.ts";
import { Channel } from "../../../frontend-framework/store.ts";
import { createHistoriesPanel, examples, historyEntryCreatedChannel } from "../history.ts";
import { modalManager } from "../modal.ts";
import { createProjectsPanel } from "../project.ts";
import { createSettings } from "../settings.ts";
import { createSuppliesPanel } from "../supply.ts";
import { toolbarClickChannel } from "../toolbar.ts";
import { createToolbar } from "../toolbar.ts";
import { Homepage, provideHomepage } from "../homepage/homepage.ts";
import { WaitingView } from "../waiting/waiting.ts";
import { createScroll } from "./scroll.ts";
import { Top } from "./top.ts";
import { createLoading } from "./loading.ts";
import { ServiceResolver } from "../../../common/dependency.ts";

export function createQuestion() {
  return div_nodes("app_content-overlay", [
    div_nodes("modal", [
      div_nodes("modal_background", [
        div_nodes("modal_container", [
          div_text("modal_title", "Do you want to quit the game?"),
          div_nodes("modal_buttons", [
            div_text("box _button", "Cancel"),
            div_text("box _button", "Confirm"),
          ]),
        ]),
      ]),
    ]),
  ]);
}

export const appState = new Channel<"homepage" | "work">();

export class AppView {
  public readonly $root: HTMLDivElement;
  protected readonly $toolbar: HTMLDivElement;

  public constructor(
    private homepage: Homepage,
  ) {
    const top = new Top();
    const scroll = createScroll();
    this.$toolbar = createToolbar();

    const switcher = new ElementSwitcher(scroll.$content);
    switcher.elements.set("loading", createLoading());
    switcher.elements.set("waiting", new WaitingView().$root);
    switcher.elements.set("homepage", homepage.$root);
    switcher.elements.set("supplies", createSuppliesPanel());
    switcher.elements.set("projects", createProjectsPanel());
    switcher.elements.set("histories", createHistoriesPanel());
    switcher.elements.set("settings", createSettings());
    switcher.switch("loading");

    historyEntryCreatedChannel.emit(examples[0]);
    historyEntryCreatedChannel.emit(examples[1]);
    historyEntryCreatedChannel.emit(examples[2]);
    historyEntryCreatedChannel.emit(examples[3]);

    toolbarClickChannel.on(({ key }) => {
      switcher.switch(key);
    });

    this.$root = div_nodes("app", [
      top.$root,
      scroll.$fragment,
      modalManager.root,
      this.$toolbar,
    ]);

    appState.on((state) => {
      if (state === "homepage") {
        this.hideToolbar();
        switcher.switch("homepage");
      } else if (state === "work") {
        this.showToolbar();
        switcher.switch("settings");
      }
    });
    appState.emit("homepage");
  }

  public hideToolbar() {
    this.$root.classList.remove("_with-toolbar");
    this.$toolbar.classList.add("_hidden");
  }

  public showToolbar() {
    this.$root.classList.add("_with-toolbar");
    this.$toolbar.classList.remove("_hidden");
  }
}

export function provideAppView(resolver: ServiceResolver) {
  return new AppView(
    resolver.resolve(provideHomepage),
  );
}
