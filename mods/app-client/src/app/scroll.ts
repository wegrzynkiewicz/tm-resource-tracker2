import { div, div_nodes } from "@acme/dom/nodes.ts";

export function createScroll(
  $root: HTMLElement,
  $content: HTMLElement,
) {
  const $detectorTop = div("scroll_detector _top");
  const $detectorBottom = div("scroll_detector _bottom");
  $root.classList.add("scroll");
  $root.replaceChildren(
    div_nodes("scroll_container", [
      $detectorTop,
      $content,
      $detectorBottom,
    ]),
  );
  const $shadowTop = div("app_shadow _top");
  const $shadowBottom = div("app_shadow _bottom");

  const nodes = [$shadowTop, $root, $shadowBottom];

  const map = new WeakMap<Element, Element>([
    [$detectorTop, $shadowTop],
    [$detectorBottom, $shadowBottom],
  ]);

  const callback = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const target = entry.target as Element;
      const shadow = map.get(target)!;
      shadow.classList.toggle(`_enabled`, !entry.isIntersecting);
    }
  };
  const options = {
    root: $root,
    threshold: [1.0],
  };
  const observer = new IntersectionObserver(callback, options);

  observer.observe($detectorTop);
  observer.observe($detectorBottom);

  return nodes;
}
