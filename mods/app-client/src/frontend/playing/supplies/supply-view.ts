import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { div } from "@acme/dom/nodes.ts";
import { frontendScopeContract } from "../../../../defs.ts";
import { appViewDependency } from "../../app/app-view.ts";
import { docTitleDependency } from "../../app/doc-title.ts";
import { View } from "../../../common.ts";

export function provideSupplyView(resolver: DependencyResolver) {
  const app = resolver.resolve(appViewDependency);
  const docTitle = resolver.resolve(docTitleDependency);

  const $root = div("app_main");

  const render = () => {
    docTitle.setTitle("Playing");
    app.contentSlot.attach($root);
    app.render();
  };

  return { $root, render };
}

export const supplyViewDependency = defineDependency<View>({
  name: "supplies-view",
  provider: provideSupplyView,
  scope: frontendScopeContract,
});
