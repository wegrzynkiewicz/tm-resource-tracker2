import { defineDependency } from "@acme/dependency/declaration.ts";
import { Context } from "@acme/dependency/context.ts";
import { div } from "@acme/dom/nodes.ts";
import { frontendScopeToken } from "./defs.ts";
import { introAppViewDependency } from "./app/intro-app-view.ts";

export function provideLoadingView(context: Context) {
  const app = context.resolve(introAppViewDependency);
  const $root = div("loading", "Loading...");

  const render = () => {
    app.contentSlot.attach($root);
    app.render();
  };

  return { $root, render };
}

export const loadingViewDependency = defineDependency({
  provider: provideLoadingView,
  scopeToken: frontendScopeToken,
});
