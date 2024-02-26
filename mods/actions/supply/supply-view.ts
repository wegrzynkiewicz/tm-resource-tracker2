import { createPanel } from "../../apps/client/features/app/panel.ts";
import { ModalManager, provideModalManager } from "../../apps/client/features/modal.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { PlayingAppView } from "../playing/playing-app-view.ts";
import { providePlayingAppView } from "../playing/playing-app-view.ts";
import { PlayingTop } from "../playing/playing-top.ts";
import { providePlayingTop } from "../playing/playing-top.ts";
import { SupplyItemView } from "./supply-item.ts";

export class SupplyView {
  public readonly items: SupplyItemView[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly top: PlayingTop,
    private readonly app: PlayingAppView,
  ) {
    this.items = [1, 2, 3].map(() => new SupplyItemView(modalManager));
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(roots);
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
  );
}
