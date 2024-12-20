import { createScroll } from "./scroll.ts";
import { modalManagerDependency } from "../modal.ts";
import { Slot } from "@framework/dom/slot.ts";
import { div, div_nodes } from "@framework/dom/nodes.ts";
import { introTopDependency } from "./intro-top.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { appSlotDependency } from "./app-slot.ts";
import { frontendScopeToken } from "../defs.ts";

export function provideAppView(context: Context) {
  const appSlot = context.resolve(appSlotDependency);
  const introTop = context.resolve(introTopDependency);
  const modalManager = context.resolve(modalManagerDependency);

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
  provider: provideAppView,
  scopeToken: frontendScopeToken,
});
