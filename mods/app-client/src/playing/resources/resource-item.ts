import { Resource, resources, ResourceStore, ResourceTarget } from "@common/resources.ts";
import { div, div_nodes } from "@acme/dom/nodes.ts";
import { ModalManager } from "../../modal.ts";
import { createResourceModal } from "./resource-modal.ts";
import { createResourceIcon } from "./defs.ts";

export function createResourcePanel(
  store: ResourceStore,
  modalManager: ModalManager,
) {
  const createResource = (resource: Resource, target: ResourceTarget) => {
    const { type } = resource;
    const $root = div(`resource _${target} _${type}`);
    {
      const $counter = div("box _counter", "0");
      $counter.addEventListener("click", async () => {
        const count = store[type][target];
        const modal = createResourceModal({ count, resource, target });
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

  function* generateResources() {
    for (const resource of resources) {
      const { type } = resource;
      if (type !== "points") {
        yield createResource(resource, "production");
      }
      yield div_nodes(`resource _icon _${type}`, [
        createResourceIcon(type),
      ]);
      yield createResource(resource, "amount");
    }
  }

  const $root = div_nodes("resources", [
    div("resources_production"),
    div("resources_round", "0"),
    ...generateResources(),
  ]);

  return { $root };
}
