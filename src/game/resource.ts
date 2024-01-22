import { div_nodes, span_text, img_props } from "../common/dom.ts";

export type ResourceType = "points" | "gold" | "steel" | "titan" | "plant" | "energy" | "heat";
export type ResourceTarget = "production" | "amount";

export interface Resource {
  count: number;
  target: ResourceTarget;
  type: ResourceType;
}

export function formatCount(count: number) {
  if (count >= 0) {
    return `+${count}`;
  }
  return count.toString();
}

export function createResource(resource: Resource) {
  const { count, target, type } = resource;
  return div_nodes(`resource --${target}`, [
    span_text('resource__label', formatCount(count)),
    img_props({
      className: 'resource__icon',
      width: "32",
      height: "32",
      alt: `${type} icon`,
      src: `/images/supplies/${type}.svg`,
    }),
  ]);
}


