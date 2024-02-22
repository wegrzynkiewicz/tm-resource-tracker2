import { div_empty, div_nodes, fragment_nodes } from "../../../../common/frontend-framework/dom.ts";

export function createScroll() {
  const $detectorTop = div_empty("scroll_detector _top");
  const $content = div_empty("app_content");
  const $detectorBottom = div_empty("scroll_detector _bottom");

  const $root = div_nodes("app_main scroll", [
    div_nodes("scroll_container", [
      $detectorTop,
      $content,
      $detectorBottom,
    ]),
  ]);
  const $shadowTop = div_empty("app_shadow _top");
  const $shadowBottom = div_empty("app_shadow _bottom");

  const $fragment = fragment_nodes([$root, $shadowTop, $shadowBottom]);

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

  return { $fragment, $content };
}
