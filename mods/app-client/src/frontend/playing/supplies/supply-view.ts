import { MapperStore } from '@acme/dom/mapper-store.ts';
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
import { playersStoreDependency } from "../../../logic/player/players-store.ts";
import { currentPlayerStoreDependency } from "../defs.ts";

export function provideSupplyView(resolver: DependencyResolver) {
  const app = resolver.resolve(playingAppViewDependency);
  const top = resolver.resolve(playingTopDependency);
  const modalManager = resolver.resolve(modalManagerDependency);
  const docTitle = resolver.resolve(docTitleDependency);
  const playersStore = resolver.resolve(playersStoreDependency);
  const currentPlayerStore = resolver.resolve(currentPlayerStoreDependency);

  const createPlayerSupplyPanel = () => {
    const store = new ResourceStore();
    const { $root } = createSupplyPanel(store, modalManager);
    return $root;
  };

  const panelsStore = new MapperStore(playersStore, createPlayerSupplyPanel);
  const { $root, swipes } = createPanel(currentPlayerStore, panelsStore);
  swipes.on((index) => currentPlayerStore.set(index));

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
