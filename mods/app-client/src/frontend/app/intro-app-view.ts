import { createScroll } from "./scroll.ts";
import { modalManagerDependency } from "../../modal.ts";
import { Slot } from "../../place.ts";
import { div, div_nodes } from "@acme/dom/nodes.ts";
import { introTopDependency } from "./intro-top.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { appSlotDependency } from "./app-slot.ts";
import { frontendScopeContract } from "../../../defs.ts";

export function provideAppView(resolver: DependencyResolver) {
  const appSlot = resolver.resolve(appSlotDependency);
  const introTop = resolver.resolve(introTopDependency);
  const modalManager = resolver.resolve(modalManagerDependency);

  const contentSlot = new Slot("content");
  const $main = div("app_main");
  const $content = div_nodes("app_content", [contentSlot.$root]);
  const scrollNodes = createScroll($main, $content);

  const $root = div_nodes("app", [
    introTop.$root,
    ...scrollNodes,
    modalManager.$root,
  ]);

  const render = () => {
    appSlot.attach($root);
  };

  return { $root, contentSlot, render };
}

export const introAppViewDependency = defineDependency({
  name: "intro-app-view",
  provider: provideAppView,
  scope: frontendScopeContract,
});
