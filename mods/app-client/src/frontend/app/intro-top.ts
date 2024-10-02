import { div, div_nodes } from "@acme/dom/nodes.ts";
import { topTitleStoreDependency } from "./top-title-store.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { frontendScopeContract } from "../../../defs.ts";

export function provideIntroTop(resolver: DependencyResolver) {
  const store = resolver.resolve(topTitleStoreDependency);

  const label = div("top_label", store.title);
  const $root = div_nodes("top", [label]);
  store.updates.on(() => label.textContent = store.title);

  return { $root }
}

export const introTopDependency = defineDependency({
  name: "intro-top",
  provider: provideIntroTop,
  scope: frontendScopeContract,
});
