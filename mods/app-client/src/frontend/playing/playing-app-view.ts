import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { div, div_nodes } from "@acme/dom/nodes.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { modalManagerDependency } from "../../modal.ts";
import { Slot } from "../../place.ts";
import { appSlotDependency } from "../app/app-slot.ts";
import { createScroll } from "../app/scroll.ts";
import { toolbarDependency } from "./toolbar.ts";

export function providePlayingAppView(resolver: DependencyResolver) {
  const appSlot = resolver.resolve(appSlotDependency);
  const toolbar = resolver.resolve(toolbarDependency);
  const modalManager = resolver.resolve(modalManagerDependency);

  const topSlot = new Slot("top");
  const contentSlot = new Slot("content");
  const $main = div("app_main");
  const $content = div_nodes("app_content", [contentSlot.$root]);
  const scrollNodes = createScroll($main, $content);

  const $root = div_nodes("app _with-toolbar", [
    topSlot.$root,
    ...scrollNodes,
    modalManager.$root,
    toolbar.$root,
  ]);

  const render = () => {
    appSlot.attach($root);
  }

  return { $root, contentSlot, topSlot, render };
}

export const playingAppViewDependency = defineDependency({
  name: "playing-app-view",
  provider: providePlayingAppView,
  scope: frontendScopeContract,
});

