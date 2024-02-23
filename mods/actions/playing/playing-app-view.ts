import { ServiceResolver } from "../../common/dependency.ts";
import { ChildSwitcher } from "../../common/frontend-framework/child-switcher.ts";
import { div_empty, div_nodes } from "../../common/frontend-framework/dom.ts";
import { createScroll } from "../../apps/client/features/app/scroll.ts";
import { PlayingTopView, providePlayingTopView } from "./playing-top-view.ts";
import { ModalManager, provideModalManager } from "../../apps/client/features/modal.ts";
import { ToolbarView, provideToolbarView } from "./toolbar-view.ts";

export class PlayingAppView {
  private readonly $root: HTMLDivElement;
  private readonly $content = div_empty("app_content");
  private readonly switcher = new ChildSwitcher(this.$content);

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly top: PlayingTopView,
    private readonly toolbar: ToolbarView,
  ) {
    const $main = div_empty("app_main");
    const scrollNodes = createScroll($main, this.$content);

    this.$root = div_nodes("app _with-toolbar", [
      top.$root,
      ...scrollNodes,
      modalManager.$root,
      toolbar.$root,
    ]);
  }

  public render($element: HTMLElement) {
    this.$content.replaceChildren($element);
    this.$root.appendChild(this.modalManager.$root);
    document.body.replaceChildren(this.$root);
  }
}


export function providePlayingAppView(resolver: ServiceResolver) {
  return new PlayingAppView(
    resolver.resolve(provideModalManager),
    resolver.resolve(providePlayingTopView),
    resolver.resolve(provideToolbarView),
  );
}
