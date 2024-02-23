import { div_empty, div_nodes } from "../../../common/frontend-framework/dom.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { ModalManager, provideModalManager } from "../../../apps/client/features/modal.ts";
import { IntroTopView, provideIntroTopView } from "./intro-top.ts";
import { createScroll } from "../../../apps/client/features/app/scroll.ts";

export class IntroAppView {
  private readonly $root: HTMLDivElement;
  private readonly $content = div_empty("app_content");

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly top: IntroTopView,
  ) {
    const $main = div_empty("app_main");
    const scrollNodes = createScroll($main, this.$content);

    this.$root = div_nodes("app", [
      top.$root,
      ...scrollNodes,
      $main,
      modalManager.$root,
    ]);
  }

  public render($element: HTMLElement) {
    this.$content.replaceChildren($element);
    this.$root.appendChild(this.modalManager.$root);
    document.body.replaceChildren(this.$root);
  }
}

export function provideIntroAppView(resolver: ServiceResolver) {
  return new IntroAppView(
    resolver.resolve(provideModalManager),
    resolver.resolve(provideIntroTopView),
  );
}
