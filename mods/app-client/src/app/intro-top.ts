import { defineDependency, DependencyResolver } from "@acme/dependency/injection.ts";
import { div_nodes, div } from "@acme/dom/nodes.ts";
import { Component } from "../common.ts";
import { TopTitleStore, topTitleStoreDependency } from "./top-title-store.ts";

export class IntroTop implements Component {
  public readonly $root: HTMLDivElement;
  public constructor(
    private readonly store: TopTitleStore,
  ) {
    const label = div("top_label", store.title)
    this.$root = div_nodes("top", [label]);
    store.on(() => label.textContent = store.title);
  }
}

export function provideIntroTop(resolver: DependencyResolver): IntroTop {
  return new IntroTop(
    resolver.resolve(topTitleStoreDependency),
  );
}
export const introTopDependency = defineDependency({
  kind: "intro-top",
  provider: provideIntroTop,
});
