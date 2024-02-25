import { div_nodes } from "../../../../common/frontend-framework/dom.ts";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function createPanel(nodes: Node[]) {
  const $root = div_nodes("panel", nodes.map((node) => div_nodes("panel_item", [node])));

  let startX = 0;
  let currentX = 0;
  let parallax = 0;
  const total = 2;

  $root.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    currentX = event.clientX;
  });
  $root.addEventListener("pointerup", (event) => {
    if (Math.abs(currentX) > 20) {
      parallax += currentX > 0 ? 1 : -1
      parallax = clamp(parallax, 0, total);
      document.documentElement.style.setProperty("--animate-parallax-current", parallax.toString());
    }
  });
  $root.addEventListener("pointermove", (event) => {
    currentX = startX - event.clientX;
    if (Math.abs(currentX) > 20) {
      const ele = parallax + (currentX / 500);
      document.documentElement.style.setProperty("--animate-parallax-current", ele.toString());
    }
  });
  return $root;
}
