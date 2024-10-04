import { IterableStore } from "@acme/dom/defs.ts";
import { NumberStore } from "@acme/dom/number-store.ts";
import { div, div_nodes } from "@acme/dom/nodes.ts";
import { clamp } from "@acme/useful/numbers.ts";
import { Channel } from "@acme/dom/channel.ts";

export function createPanel(
  indexStore: NumberStore,
  nodesStore: IterableStore<Node>,
) {
  const $container = div("panel_container _transition");
  const $root = div_nodes("panel", [$container]);

  let startX = 0;
  let currentX = 0;
  let parallax = 0;

  const swipes = new Channel<[number]>();

  nodesStore.updates.on(() => {
    const items = nodesStore.items.map((node) => div_nodes("panel_item", [node]));
    $container.replaceChildren(...items);
  });

  const animate = (value: number) => {
    document.documentElement.style.setProperty("--animate-parallax-current", value.toString());
  };

  indexStore.updates.on(() => {
    parallax = indexStore.value;
    animate(parallax);
  });

  $container.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    currentX = 0;
    $container.classList.remove("_transition");
  });

  $container.addEventListener("pointerup", () => {
    if (Math.abs(currentX) > 50) {
      parallax += currentX > 0 ? 1 : -1;
      parallax = clamp(parallax, 0, nodesStore.length - 1);
      swipes.emit(parallax);
    }
    $container.classList.add("_transition");
    animate(parallax);
  });

  $container.addEventListener("pointermove", (event) => {
    const width = $root.clientWidth;
    currentX = startX - event.clientX;
    animate(parallax + (currentX / width));
  });

  return { $root, swipes };
}
