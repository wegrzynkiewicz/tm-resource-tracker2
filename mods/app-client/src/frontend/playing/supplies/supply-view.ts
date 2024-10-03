import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { docTitleDependency } from "../../app/doc-title.ts";
import { View } from "../../../common.ts";
import { controllerScopeContract } from "../../../../defs.ts";
import { playingAppViewDependency } from "../playing-app-view.ts";
import { playingTopDependency } from "../playing-top.ts";
import { createSupplyPanel } from "./supply-item.ts";
import { ResourceStore } from "@common/resources.ts";
import { modalManagerDependency } from "../../../modal.ts";
import { createPanel } from "../../app/panel.ts";
import { SelectorStore } from "../../utils/selector.ts";

export function provideSupplyView(resolver: DependencyResolver) {
  const app = resolver.resolve(playingAppViewDependency);
  const top = resolver.resolve(playingTopDependency);
  const modalManager = resolver.resolve(modalManagerDependency);
  const docTitle = resolver.resolve(docTitleDependency);

  const createPlayerSupplyPanel = () => {
    const store = new ResourceStore();
    const { $root } = createSupplyPanel(store, modalManager);
    return $root;
  };

  const playerIndex = new SelectorStore([
    { key: "black", name: "Black" },
    { key: "blue", name: "Blue" },
    { key: "green", name: "Green" },
    { key: "red", name: "Red" },
    { key: "yellow", name: "Yellow" },
  ]);

  const items = [1, 2, 3, 4, 5].map(createPlayerSupplyPanel);
  const $root = createPanel(playerIndex, items);

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
