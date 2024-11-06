import { div, div_nodes } from "@framework/dom/nodes.ts";
import { topTitleStoreDependency } from "./top-title-store.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { frontendScopeToken } from "../defs.ts";

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
  scopeToken: frontendScopeToken,
});
