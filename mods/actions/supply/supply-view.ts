import { createPanel } from "../../apps/client/features/app/panel.ts";
import { ModalManager, provideModalManager } from "../../apps/client/features/modal.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { PlayingAppView } from "../playing/playing-app-view.ts";
import { providePlayingAppView } from "../playing/playing-app-view.ts";
import { SupplyItemView } from "./supply-item-view.ts";

export class SupplyView {
  public readonly items: SupplyItemView[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly app: PlayingAppView,
  ) {
    this.items = [1, 2, 3].map(() => new SupplyItemView(modalManager));
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(roots);
  }

  public render() {
    this.app.render(this.$root);
  }
}

export function provideSupplyView(resolver: ServiceResolver) {
  return new SupplyView(
    resolver.resolve(provideModalManager),
    resolver.resolve(providePlayingAppView),
  );
}
