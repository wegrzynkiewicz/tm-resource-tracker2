import { fragment_nodes, div_text, img_props, div_nodes, div_empty } from "../common/dom.ts";
import { onClick } from "../common.ts";
import { Channel, Signal } from "../common/store.ts";
import { ResourceGroup, ResourceTarget } from "../data/resources.ts";
import { ResourceType, resources, createResourceGroup } from "../data/resources.ts";
import { createSupplyModal } from "./supply-modal.ts";
import { modalManager } from "./modal.ts";

interface SupplyClicked {
  type: ResourceType;
  target: ResourceTarget;
}

function createSupply(
  type: ResourceType,
  signal: Signal<ResourceGroup>,
  channel: Channel<SupplyClicked>,
) {
  const { amount, production } = signal.value[type];
  const $production = div_text('box _counter', production);
  const $amount = div_text('box _counter', amount);

  const $root = fragment_nodes([
    div_nodes(`supply _production _${type}`, [
      $production,
    ]),
    div_nodes(`supply _icon _${type}`, [
      img_props({
        className: 'supply_icon',
        width: "64",
        height: "64",
        alt: "supply-icon",
        src: `/images/supplies/${type}.svg`,
      }),
    ]),
    div_nodes(`supply _amount _${type}`, [
      $amount,
    ]),
  ]);

  signal.updates.on(() => {
    const { amount, production } = signal.value[type];
    $amount.textContent = amount.toString();
    $production.textContent = production.toString();
  });

  onClick($amount, () => channel.emit({ type, target: "amount" }));
  onClick($production, () => channel.emit({ type, target: "production" }));

  return $root;
}

export function createSupplies() {
  const signal = new Signal(createResourceGroup(20));
  const channel = new Channel<SupplyClicked>();
  channel.on(async ({ type, target }) => {
    const count = signal.value[type][target];
    const modal = createSupplyModal({ type, target, count });
    modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
    signal.value[type][target] = result.value;
    signal.update();
  });
  return div_nodes("panel_item", [
    div_nodes("supplies", [
      div_empty("supplies_production"),
      div_text("supplies_round", "0"),
      ...resources.map(({ type }) => {
        return createSupply(type, signal, channel);
      }),
    ]),
  ]);
}

export function createSuppliesPanel() {
  return div_nodes("panel", [1, 2, 3].map(createSupplies));
}
