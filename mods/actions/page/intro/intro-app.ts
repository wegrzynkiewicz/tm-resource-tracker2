import { div_empty, div_nodes } from "../../../common/frontend-framework/dom.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { ModalManager, provideModalManager } from "../../../apps/client/features/modal.ts";
import { IntroTopView, provideIntroTopView } from "./intro-top.ts";
import { createScroll } from "../../../apps/client/features/app/scroll.ts";
import { Place } from "../../../apps/client/features/place.ts";
import { provideAppPlace } from "../../../apps/client/features/place.ts";

export class IntroAppView {
  public readonly topPlace = new Place('top');
  public readonly modalManagerPlace = new Place('modal-manager');
  public readonly contentPlace = new Place('modal-manager');
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly top: IntroTopView,
    private readonly appPlace: Place,
  ) {
    const $main = div_empty("app_main");
    const $content = div_nodes("app_content", [this.contentPlace.$root]);
    const scrollNodes = createScroll($main, $content);

    this.$root = div_nodes("app", [
      top.$root,
      ...scrollNodes,
      $main,
      modalManager.$root,
    ]);
  }

  public render($element: HTMLElement) {
    this.modalManagerPlace.attach(this.modalManager.$root);
    this.contentPlace.attach($element);
    this.appPlace.attach(this.$root);
  }
}

export function provideIntroAppView(resolver: ServiceResolver) {
  return new IntroAppView(
    resolver.resolve(provideModalManager),
    resolver.resolve(provideIntroTopView),
    resolver.resolve(provideAppPlace),
  );
}
