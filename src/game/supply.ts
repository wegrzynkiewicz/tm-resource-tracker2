import { mapToFragment } from "../common.ts";
import { fragment_nodes, div_text, img_props, div_nodes, div_empty } from "../common/dom.ts";
import { Signal } from "../common/store.ts";
import { ResourceType, ResourceGroup, resources, createResourceGroup } from "../data/resources.ts";
import { modalManager } from "./modal.ts";
import { createSupplyModal } from "./supply-modal.ts";

function createSupply(
  { type, signal }: {
    type: ResourceType,
    signal: Signal<ResourceGroup>,
  }
) {
  const production = div_text('box --counter', signal.value[type].production.toString());
  const amount = div_text('box --counter', signal.value[type].amount.toString());

  const root = fragment_nodes([
    div_nodes(`supply --production --${type}`, [
      production,
    ]),
    div_nodes(`supply --icon --${type}`, [
      img_props({
        className: 'supply__icon',
        width: "64",
        height: "64",
        alt: "supply-icon",
        src: `/images/supplies/${type}.svg`,
      }),
    ]),
    div_nodes(`supply --amount --${type}`, [
      amount,
    ]),
  ]);

  signal.updates.subscribers.add(({ value }) => {
    amount.textContent = value[type].amount.toString();
    production.textContent = value[type].production.toString();
  });

  production.addEventListener('click', async () => {
    const modal = createSupplyModal({
      count: signal.value[type].production,
      type,
      target: "production",
    });
    modalManager.mount(modal);
    const response = await modal.promise;
    if (response.type === "cancel") {
      return;
    }
    signal.value[type].production += response.value;
    signal.update();
  });

  amount.addEventListener('click', async () => {
    const modal = createSupplyModal({
      count: signal.value[type].amount,
      type,
      target: "amount",
    });
    modalManager.mount(modal);
    const response = await modal.promise;
    if (response.type === "cancel") {
      return;
    }
    signal.value[type].amount += response.value;
    signal.update();
  });

  return root;
}

export function createSupplies() {
  return div_nodes("panel__item", [
    div_nodes("supplies", [
      div_empty("supplies__production"),
      div_text("supplies__round", "0"),
      mapToFragment(resources, ({type}) => {
        const signal = new Signal(createResourceGroup(20));
        return createSupply({type, signal})
      }),
    ]),
  ]);
}

export function createSuppliesPanel() {
  return div_nodes("panel", [
    mapToFragment([1, 2, 3], createSupplies),
  ]);
}
