import { createPanel } from "../../apps/client/features/app/panel.ts";
import { ModalManager, provideModalManager } from "../../apps/client/features/modal.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { SupplyPanelItemView } from "./supply-panel-item-view.ts";

export class SupplyPanelView {
  public readonly items: SupplyPanelItemView[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly modalManager: ModalManager,
  ) {
    this.items = [1, 2, 3].map(() => new SupplyPanelItemView(modalManager));
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(roots);
  }
}

export function provideSupplyPanelView(resolver: ServiceResolver) {
  return new SupplyPanelView(
    resolver.resolve(provideModalManager),
  );
}
