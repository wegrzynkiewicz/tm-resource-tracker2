import { ResourceType } from "@common/resources.ts";
import { img } from "@acme/dom/nodes.ts";

export function createSupplyIcon(type: ResourceType) {
  const $img = img("supply_icon");
  $img.width = 64;
  $img.height = 64;
  $img.alt = "supply-icon";
  $img.src = `/images/supplies/${type}.svg`;
  return $img;
}
