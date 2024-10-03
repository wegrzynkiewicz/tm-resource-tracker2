import { div_nodes } from "@acme/dom/nodes.ts";
import { clamp } from "@acme/useful/numbers.ts";
import { SelectorStore } from "../utils/selector.ts";

export function createPanel(store: SelectorStore, nodes: Node[]) {
  const items = nodes.map((node) => div_nodes("panel_item", [node]))
  const $root = div_nodes("panel _transition", items);

  let startX = 0;
  let currentX = 0;
  let parallax = 0;
  const total = store.options.length - 1;

  const update = (index: number) => {
    parallax = index;
    $root.classList.add("_transition");
    document.documentElement.style.setProperty("--animate-parallax-current", parallax.toString());
  }
  store.updates.on(update);
  update(0);

  $root.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    currentX = 0;
    $root.classList.remove("_transition");
  });

  $root.addEventListener("pointerup", (event) => {
    if (Math.abs(currentX) > 50) {
      parallax += currentX > 0 ? 1 : -1;
      parallax = clamp(parallax, 0, total);
    }
    store.setIndex(parallax);
  });

  $root.addEventListener("pointermove", (event) => {
    currentX = startX - event.clientX;
    const ele = parallax + (currentX / 500);
    document.documentElement.style.setProperty("--animate-parallax-current", ele.toString());
  });

  return $root;
}
