import { SelectorStore } from "../utils/selector.ts";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function createPanel(store: SelectorStore, nodes: Node[]) {
  const $root = div_nodes("panel _transition", nodes.map((node) => div_nodes("panel_item", [node])));

  let startX = 0;
  let currentX = 0;
  let parallax = 0;
  const total = store.options.length - 1;

  store.on(({ index }) => {
    parallax = index;
    $root.classList.add("_transition");
    document.documentElement.style.setProperty("--animate-parallax-current", parallax.toString());
  });

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
