import { div_empty, div_nodes, div_text, img_props } from "../../common/frontend-framework/dom.ts";
import { onClick } from "../../apps/client/features/common.ts";
import { Signal } from "../../common/frontend-framework/store.ts";
import { ResourceGroup, ResourceTarget } from "../../common/resources.ts";
import { createResourceGroup, resources, ResourceType } from "../../common/resources.ts";
import { createSupplyModal } from "./supply-modal.ts";
import { ModalManager } from "../../apps/client/features/modal.ts";
import { Supply } from "./common.ts";

export class SupplyPanelItemView {
  public readonly $root: HTMLDivElement;
  public readonly signal: Signal<ResourceGroup>;

  public constructor(
    private readonly modalManager: ModalManager,
  ) {
    this.signal = new Signal(createResourceGroup(20));
    this.$root = div_nodes("supplies", [
      div_empty("supplies_production"),
      div_text("supplies_round", "0"),
      ...this.generateSupplies(),
    ]);
  }

  public async whenSupplyClicked({ type, target }: Supply) {
    const count = this.signal.value[type][target];
    const modal = createSupplyModal({ type, target, count });
    this.modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
    this.signal.value[type][target] = result.value;
    this.signal.emit();
  }

  protected *generateSupplies() {
    for (const { type } of resources) {
      yield this.createSupply("production", type);
      yield div_nodes(`supply _icon _${type}`, [
        img_props({
          className: "supply_icon",
          width: "64",
          height: "64",
          alt: "supply-icon",
          src: `/images/supplies/${type}.svg`,
        }),
      ]);
      yield this.createSupply("amount", type);
    }
  }

  protected createSupply(target: ResourceTarget, type: ResourceType) {
    const $counter = div_text("box _counter", "0");
    const $root = div_nodes(`supply _${target} _${type}`, [$counter]);
    this.signal.on((value) => {
      const count = value[type][target];
      $counter.textContent = count.toString();
    });
    onClick($counter, () => this.whenSupplyClicked({ type, target }));
    return $root;
  }
}
