import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { div } from "@acme/dom/nodes.ts";
import { docTitleDependency } from "../../app/doc-title.ts";
import { View } from "../../../common.ts";
import { controllerScopeContract } from "../../../../defs.ts";
import { playingAppViewDependency } from "../playing-app-view.ts";
import { playingTopDependency } from "../playing-top.ts";

export function provideSupplyView(resolver: DependencyResolver) {
  const app = resolver.resolve(playingAppViewDependency);
  const top = resolver.resolve(playingTopDependency);
  const docTitle = resolver.resolve(docTitleDependency);

  const $root = div("app_main");

  const render = () => {
    docTitle.setTitle("Supplies");
    app.topSlot.attach(top.$root);
    app.contentSlot.attach($root);
    app.render();
  };

  return { $root, render };
}

export const supplyViewDependency = defineDependency<View>({
  name: "supplies-view",
  provider: provideSupplyView,
  scope: controllerScopeContract,
});
