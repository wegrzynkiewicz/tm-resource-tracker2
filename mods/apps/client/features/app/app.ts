import { div_nodes, div_text } from "../../../../common/frontend-framework/dom.ts";
import { ElementSwitcher } from "../../../../common/frontend-framework/element-switcher.ts";
import { createHistoriesPanel, historyEntryCreatedChannel } from "../history.ts";
import { createProjectsPanel } from "../project.ts";
import { createSettings } from "../settings.ts";
import { createSuppliesPanel } from "../supply.ts";
import { toolbarClickChannel } from "../toolbar.ts";
import { createToolbar } from "../toolbar.ts";
import { createScroll } from "./scroll.ts";
import { TopView, provideTopView } from "./top.ts";
import { createLoading } from "./loading.ts";
import { ServiceResolver } from "../../../../common/dependency.ts";
import { HomepageView, provideHomepageView } from "../homepage.ts";
import { ClientConfig, provideClientConfig } from "../config.ts";
import { Channel } from "../../../../common/channel.ts";
import { examples } from "../../../../common/history.ts";
import { ModalManager, provideModalManager } from "../modal.ts";

export const appState = new Channel<"homepage" | "playing" | "waiting" | "loading">();

export class AppView {
  public readonly $root: HTMLDivElement;
  protected readonly $content: HTMLDivElement;
  protected readonly $toolbar: HTMLDivElement;
  protected readonly $loading = createLoading();

  public constructor(
    private readonly clientConfig: ClientConfig,
    private readonly homepageView: HomepageView,
    private readonly modalManager: ModalManager,
    public readonly top: TopView,
  ) {
    const scroll = createScroll();
    this.$content = scroll.$content;
    this.$toolbar = createToolbar();

    const switcher = new ElementSwitcher(scroll.$content);
    switcher.elements.set("loading", createLoading());
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
      top.$root,
      scroll.$fragment,
      this.modalManager.$root,
      this.$toolbar,
    ]);
    this.loading();
  }

  public mount($element: HTMLElement) {
    this.$content.replaceChildren($element);
  }

  public showToolbar() {
    this.$root.classList.add("_with-toolbar");
    this.$toolbar.classList.remove("_hidden");
  }

  public hideToolbar() {
    this.$root.classList.remove("_with-toolbar");
    this.$toolbar.classList.add("_hidden");
  }

  public homepage() {
    this.top.setLabel(this.clientConfig.title);
    this.mount(this.homepageView.$root);
    this.hideToolbar();
  }

  public loading() {
    this.top.setLabel(this.clientConfig.title);
    this.mount(this.$loading);
    this.hideToolbar();
  }
}

export function provideAppView(resolver: ServiceResolver) {
  return new AppView(
    resolver.resolve(provideClientConfig),
    resolver.resolve(provideHomepageView),
    resolver.resolve(provideModalManager),
    resolver.resolve(provideTopView),
  );
}
