import { ResourceType } from "@common/resources.ts";
import { img } from "@acme/dom/nodes.ts";

export function createResourceIcon(type: ResourceType) {
  const $img = img("resource_icon");
  $img.width = 64;
  $img.height = 64;
  $img.alt = "resource-icon";
  $img.src = `/images/resources/${type}.svg`;
  return $img;
}
