import { Resource } from "@common/resources/defs.ts";
import { div, div_nodes } from "@framework/dom/nodes.ts";
import { ModalManager } from "../../modal.ts";
import { createResourceModal } from "./resource-modal.ts";
import { createResourceIcon } from "./defs.ts";
import { Channel } from "@framework/dom/channel.ts";
import { resources, ResourceStore } from "@common/resources/defs.ts";
import { ResourceTarget } from "@common/resources/resource-target.layout.compiled.ts";

export interface ResourceBox {
  $root: HTMLElement;
  resource: Resource;
  target: ResourceTarget;
  update(value: string): void;
}

export function createResourcePanel(
  store: ResourceStore,
  modalManager: ModalManager,
) {
  const clicks = new Channel<[ResourceBox]>();

  const createResourceBox = (resource: Resource, target: ResourceTarget) => {
    const $counter = div("box _counter", "0");
    const $root = div_nodes(`resource _${target} _${resource.type}`, [$counter]);
    const update = (value: string) => $counter.textContent = value;
    const box: ResourceBox = { $root, resource, target, update };
    $root.addEventListener("click", () => clicks.emit(box));
    return box;
  };

  function* generateBoxes() {
    for (const resource of resources) {
      yield createResourceBox(resource, "production");
      yield createResourceBox(resource, "amount");
    }
  }
  const [_, ...boxes] = [...generateBoxes()];

  const $root = div_nodes("resources", [
    div("resources_production"),
    div("resources_round", "0"),
    ...resources.map((resource) => createResourceIcon(resource.type)),
    ...boxes.map((box) => box.$root),
  ]);

  const update = () => {
    for (const { resource, target, update } of boxes) {
      update(store[resource.type][target].toString());
    }
  };
  store.updates.on(update);
  update();

  clicks.on(async (box) => {
    const { resource, target, update } = box;
    const count = store[resource.type][target];
    const modal = createResourceModal({ count, resource, target });
    modalManager.mount(modal);
    const [result, value] = await modal.ready;
    if (result === false) {
      return;
    }
    update(value.toString());
  });

  return { $root };
}
