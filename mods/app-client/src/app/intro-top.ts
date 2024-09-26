import { div, div_nodes } from "@acme/dom/nodes.ts";
import { Component } from "../common.ts";
import { TopTitleStore, topTitleStoreDependency } from "./top-title-store.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { frontendScopeContract } from "../../defs.ts";

export class IntroTop implements Component {
  public readonly $root: HTMLDivElement;
  public constructor(
    private readonly store: TopTitleStore,
  ) {
    const label = div("top_label", store.title);
    this.$root = div_nodes("top", [label]);
    store.updates.on(() => label.textContent = store.title);
  }
}

export function provideIntroTop(resolver: DependencyResolver): IntroTop {
  return new IntroTop(
    resolver.resolve(topTitleStoreDependency),
  );
}

export const introTopDependency = defineDependency({
  name: "intro-top",
  provider: provideIntroTop,
  scope: frontendScopeContract,
});
