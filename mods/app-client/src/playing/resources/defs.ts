import { div_nodes, img } from "@framework/dom/nodes.ts";
import { ResourceType } from "@common/resources/resource-type.layout.compiled.ts";

export function createResourceImage(type: ResourceType) {
  const $img = img("resource_icon");
  $img.width = 64;
  $img.height = 64;
  $img.alt = "resource-icon";
  $img.src = `/images/resources/${type}.svg`;
  return $img;
}

export function createResourceIcon(type: ResourceType) {
  return div_nodes(`resource _icon _${type}`, [
    createResourceImage(type),
  ]);
}
