import { createPanel } from "../../app-client/src/app/panel.ts";
import { ModalManager, provideModalManager } from "../../app-client/src/modal.ts";
import { SelectorStore } from "../../app-client/src/selector.ts";
import { ServiceResolver } from "../../core/dependency.ts";
import { PlayingAppView } from "../playing/playing-app-view.ts";
import { providePlayingAppView } from "../playing/playing-app-view.ts";
import { PlayingTop, providePlayingPlayerStore } from "../playing/playing-top.ts";
import { providePlayingTop } from "../playing/playing-top.ts";
import { SupplyItemView } from "./supply-item.ts";

export class SupplyView {
  public readonly items: SupplyItemView[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly top: PlayingTop,
    private readonly app: PlayingAppView,
    private readonly playerIndex: SelectorStore,
  ) {
    this.items = [1, 2, 3].map(() => new SupplyItemView(modalManager));
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(playerIndex, roots);
  }

  public render() {
    this.top.setLabel("Supplies");
    this.app.render(
      this.top.$root,
      this.$root,
    );
  }
}

export function provideSupplyView(resolver: ServiceResolver) {
  return new SupplyView(
    resolver.resolve(provideModalManager),
    resolver.resolve(providePlayingTop),
    resolver.resolve(providePlayingAppView),
    resolver.resolve(providePlayingPlayerStore),
  );
}
