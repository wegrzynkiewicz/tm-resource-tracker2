import { Resource, resources, ResourceStore, ResourceTarget } from "@common/resources.ts";
import { div, div_nodes } from "@acme/dom/nodes.ts";
import { ModalManager } from "../../../modal.ts";
import { createSupplyModal } from "./supply-modal.ts";
import { createSupplyIcon } from "./defs.ts";

export function createSupplyPanel(
  store: ResourceStore,
  modalManager: ModalManager,
) {
  const createSupply = (resource: Resource, target: ResourceTarget) => {
    const { type } = resource;
    const $root = div(`supply _${target} _${type}`);
    {
      const $counter = div("box _counter", "0");
      $counter.addEventListener("click", async () => {
        const count = store[type][target];
        const modal = createSupplyModal({ count, resource, target });
        modalManager.mount(modal);
        const [result, value] = await modal.ready;
        if (result === false) {
          return;
        }
        $counter.textContent = value.toString();
        store.updates.emit();
      });
      $root.appendChild($counter);
    }
    return $root;
  };

  function* generateSupplies() {
    for (const resource of resources) {
      const { type } = resource;
      if (type !== "points") {
        yield createSupply(resource, "production");
      }
      yield div_nodes(`supply _icon _${type}`, [
        createSupplyIcon(type),
      ]);
      yield createSupply(resource, "amount");
    }
  }

  const $root = div_nodes("supplies", [
    div("supplies_production"),
    div("supplies_round", "0"),
    ...generateSupplies(),
  ]);

  return { $root };
}
