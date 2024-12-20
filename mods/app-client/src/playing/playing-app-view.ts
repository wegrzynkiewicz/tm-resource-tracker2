import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { div, div_nodes } from "@framework/dom/nodes.ts";
import { frontendScopeToken } from "../defs.ts";
import { modalManagerDependency } from "../modal.ts";
import { Slot } from "@framework/dom/slot.ts";
import { appSlotDependency } from "../app/app-slot.ts";
import { createScroll } from "../app/scroll.ts";
import { toolbarDependency } from "./toolbar.ts";

export function providePlayingAppView(context: Context) {
  const appSlot = context.resolve(appSlotDependency);
  const toolbar = context.resolve(toolbarDependency);
  const modalManager = context.resolve(modalManagerDependency);

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
  };

  return { $root, contentSlot, topSlot, render };
}

export const playingAppViewDependency = defineDependency({
  provider: providePlayingAppView,
  scopeToken: frontendScopeToken,
});
