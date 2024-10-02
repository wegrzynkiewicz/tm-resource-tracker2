import { createScroll } from "./scroll.ts";
import { ModalManager, modalManagerDependency } from "../../modal.ts";
import { Slot } from "../../place.ts";
import { div, div_nodes } from "@acme/dom/nodes.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { IntroTop, introTopDependency } from "./intro-top.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { View } from "../../common.ts";

export class AppView implements View {
  public readonly $root: HTMLDivElement;
  public readonly topSlot = new Slot("top");
  public readonly contentSlot = new Slot("content");
  public readonly toolbarSlot = new Slot("toolbar");

  public constructor(
    private readonly appSlot: Slot,
    private readonly introTop: IntroTop,
    private readonly modalManager: ModalManager,
  ) {
    const $main = div("app_main");
    const $content = div_nodes("app_content", [this.contentSlot.$root]);
    const scrollNodes = createScroll($main, $content);

    this.$root = div_nodes("app", [
      this.topSlot.$root,
      ...scrollNodes,
      this.modalManager.$root,
      this.toolbarSlot.$root,
    ]);
    this.topSlot.attach(this.introTop.$root);
  }

  public render() {
    this.appSlot.attach(this.$root);
  }
}

export function provideAppView(resolver: DependencyResolver) {
  return new AppView(
    resolver.resolve(appSlotDependency),
    resolver.resolve(introTopDependency),
    resolver.resolve(modalManagerDependency),
  );
}

export const appViewDependency = defineDependency({
  name: "app-view",
  provider: provideAppView,
  scope: frontendScopeContract,
});

export function provideAppSlot() {
  return new Slot("app");
}

export const appSlotDependency = defineDependency({
  name: "app-slot",
  provider: provideAppSlot,
  scope: frontendScopeContract,
});
