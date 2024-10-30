import { Resource } from "@common/resources/defs.ts";
import { div, div_nodes } from "@acme/dom/nodes.ts";
import { ModalManager } from "../../modal.ts";
import { createResourceModal } from "./resource-modal.ts";
import { createResourceIcon } from "./defs.ts";
import { Channel } from "@acme/dom/channel.ts";
import { resources, ResourceStore } from "@common/resources/defs.ts";
import { ResourceTarget } from "@common/resources/resource-target.layout.compiled.ts";

export function createResourcePanel(
  store: ResourceStore,
  modalManager: ModalManager,
) {
  const updates = new Channel<[Resource, ResourceTarget, number]>();

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
        updates.emit(resource, target, value);
      });

      const update = () => {
        $counter.textContent = store[type][target].toString();
      };
      store.updates.on(update);
      update();

      $root.appendChild($counter);
    }
    return $root;
  };

  function* generateResources() {
    const [points, ...otherResources] = resources;
    yield div("resources_production");
    yield div("resources_round", "0");
    yield createResourceIcon("points");
    yield createResource(points, "amount");
    for (const resource of otherResources) {
      const { type } = resource;
      yield createResource(resource, "production");
      yield createResourceIcon(type);
      yield createResource(resource, "amount");
    }
  }

  const $root = div_nodes("resources", [...generateResources()]);

  return { $root };
}
