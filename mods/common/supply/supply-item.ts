import { ResourceGroup, ResourceTarget } from "../../core/resources.ts";
import { createResourceGroup, resources, ResourceType } from "../../core/resources.ts";
import { createSupplyModal } from "./supply-modal.ts";
import { ModalManager } from "../../app-client/src/modal.ts";
import { Supply } from "./common.ts";

export class SupplyItemView {
  public readonly $root: HTMLDivElement;
  public readonly signal: Signal<ResourceGroup>;

  public constructor(
    private readonly modalManager: ModalManager,
  ) {
    this.signal = new Signal(createResourceGroup(20));
    this.$root = div_nodes("supplies", [
      div("supplies_production"),
      div("supplies_round", "0"),
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
    const $counter = div("box _counter", "0");
    const $root = div_nodes(`supply _${target} _${type}`, [$counter]);
    this.signal.on((value) => {
      const count = value[type][target];
      $counter.textContent = count.toString();
    });
    onClick($counter, () => this.whenSupplyClicked({ type, target }));
    return $root;
  }
}
