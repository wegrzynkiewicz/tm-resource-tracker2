import { DependencyResolver } from "@acme/dependency/service-resolver.ts";

import { createScroll } from "../../app-client/src/frontend/app/scroll.ts";
import { ModalManager, provideModalManager } from "../../app-client/src/modal.ts";
import { provideToolbarView, ToolbarView } from "./toolbar.ts";
import { provideAppPlace, Slot } from "../../app-client/src/place.ts";

export class PlayingAppView {
  public readonly topPlace = new Slot("top");
  public readonly modalManagerPlace = new Slot("modal-manager");
  public readonly contentPlace = new Slot("modal-manager");
  private readonly $root: HTMLDivElement;

  public constructor(
    private readonly appPlace: Slot,
    private readonly modalManager: ModalManager,
    private readonly toolbar: ToolbarView,
  ) {
    const $main = div("app_main");
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

export function providePlayingAppView(resolver: DependencyResolver) {
  return new PlayingAppView(
    resolver.resolve(appPlaceDependency),
    resolver.resolve(modalManagerDependency),
    resolver.resolve(toolbarViewDependency),
  );
}
