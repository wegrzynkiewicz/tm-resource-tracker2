import { div, div_nodes } from "@acme/dom/nodes.ts";
import { topTitleStoreDependency } from "./top-title-store.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { Context } from "@acme/dependency/context.ts";
import { frontendScopeContract } from "../../../defs.ts";

export function provideIntroTop(context: Context) {
  const store = context.resolve(topTitleStoreDependency);

  const label = div("top_label", store.title);
  const $root = div_nodes("top", [label]);

  const update = () => label.textContent = store.title;
  store.updates.on(update);

  const dispose = () => {
    store.updates.off(update);
  };

  return { $root, dispose };
}

export const introTopDependency = defineDependency({
  provider: provideIntroTop,
  scope: frontendScopeContract,
});
