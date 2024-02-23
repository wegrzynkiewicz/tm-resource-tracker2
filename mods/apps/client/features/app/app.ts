import { div_empty, div_nodes } from "../../../../common/frontend-framework/dom.ts";
import { ChildSwitcher } from "../../../../common/frontend-framework/child-switcher.ts";
import { createScroll } from "./scroll.ts";
import { TopView, provideTopView } from "./top.ts";
import { ServiceResolver } from "../../../../common/dependency.ts";
import { ModalManager, provideModalManager } from "../modal.ts";
import { Toolbar, provideToolbar } from "../toolbar.ts";

export class AppView {
  public readonly $root: HTMLDivElement;
  public readonly $content = div_empty("app_content");
  public readonly switcher = new ChildSwitcher(this.$content);

  public constructor(
    modalManager: ModalManager,
    public readonly top: TopView,
    public readonly toolbar: Toolbar,
  ) {
    const $main = div_empty("app_main");
    const scrollNodes = createScroll($main, this.$content);

    toolbar.signal.on((key) => {
    //   this.switcher.switch(key);
    });

    this.$root = div_nodes("app", [
      top.$root,
      ...scrollNodes,
      modalManager.$root,
      toolbar.$root,
    ]);
  }

  public mount($element: HTMLElement) {
    this.$content.replaceChildren($element);
  }

  public showToolbar() {
    this.$root.classList.add("_with-toolbar");
    this.toolbar.show();
  }

  public hideToolbar() {
    this.$root.classList.remove("_with-toolbar");
    this.toolbar.hide();
  }
}

export function provideAppView(resolver: ServiceResolver) {
  return new AppView(
    resolver.resolve(provideModalManager),
    resolver.resolve(provideTopView),
    resolver.resolve(provideToolbar),
  );
}
