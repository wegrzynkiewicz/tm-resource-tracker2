import { ServiceResolver } from "../../core/dependency.ts";
import { div_empty, div_nodes } from "../../core/frontend-framework/dom.ts";
import { createScroll } from "../../app-client/src/app/scroll.ts";
import { ModalManager, provideModalManager } from "../../app-client/src/modal.ts";
import { ToolbarView, provideToolbarView } from "./toolbar.ts";
import { Place, provideAppPlace } from "../../app-client/src/place.ts";

export class PlayingAppView {
  public readonly topPlace = new Place('top');
  public readonly modalManagerPlace = new Place('modal-manager');
  public readonly contentPlace = new Place('modal-manager');
  private readonly $root: HTMLDivElement;

  public constructor(
    private readonly appPlace: Place,
    private readonly modalManager: ModalManager,
    private readonly toolbar: ToolbarView,
  ) {
    const $main = div_empty("app_main");
    const $content = div_nodes("app_content", [this.contentPlace.$root]);
    const scrollNodes = createScroll($main, $content);

    this.$root = div_nodes("app _with-toolbar", [
      this.topPlace.$root,
      ...scrollNodes,
      this.modalManagerPlace.$root,
      toolbar.$root,
    ]);
  }

  public render(
    $top: HTMLElement,
    $element: HTMLElement,
  ) {
    this.topPlace.attach($top);
    this.modalManagerPlace.attach(this.modalManager.$root);
    this.contentPlace.attach($element);
    this.appPlace.attach(this.$root);
  }
}

export function providePlayingAppView(resolver: ServiceResolver) {
  return new PlayingAppView(
    resolver.resolve(provideAppPlace),
    resolver.resolve(provideModalManager),
    resolver.resolve(provideToolbarView),
  );
}
