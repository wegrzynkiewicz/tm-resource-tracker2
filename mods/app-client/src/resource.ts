import { div_nodes, img_props, span_text } from "../../core/frontend-framework/dom.ts";
import { Resource } from "../../core/resources.ts";

export function formatCount(count: number) {
  if (count >= 0) {
    return `+${count}`;
  }
  return count.toString();
}

export function createResource(resource: Resource) {
  const { count, target, type } = resource;
  return div_nodes(`resource _${target}`, [
    span_text("resource_label", formatCount(count)),
    img_props({
      className: "resource_icon",
      width: "32",
      height: "32",
      alt: `${type} icon`,
      src: `/images/supplies/${type}.svg`,
    }),
  ]);
}
