import { MapperStore } from "@acme/dom/mapper-store.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { docTitleDependency } from "../../app/doc-title.ts";
import { View } from "../../../common.ts";
import { controllerScopeContract } from "../../../../defs.ts";
import { playingAppViewDependency } from "../playing-app-view.ts";
import { playingTopDependency } from "../playing-top.ts";
import { createResourcePanel } from "./resource-item.ts";
import { ResourceStore } from "@common/resources.ts";
import { modalManagerDependency } from "../../../modal.ts";
import { createPanel } from "../../app/panel.ts";
import { playersStoreDependency } from "../../../logic/player/players-store.ts";
import { currentPlayerStoreDependency } from "../defs.ts";

export function provideResourcesView(resolver: DependencyResolver) {
  const app = resolver.resolve(playingAppViewDependency);
  const top = resolver.resolve(playingTopDependency);
  const modalManager = resolver.resolve(modalManagerDependency);
  const docTitle = resolver.resolve(docTitleDependency);
  const playersStore = resolver.resolve(playersStoreDependency);
  const currentPlayerStore = resolver.resolve(currentPlayerStoreDependency);

  const createPlayerResourcePanel = () => {
    const store = new ResourceStore();
    const { $root } = createResourcePanel(store, modalManager);
    return $root;
  };

  const panelsStore = new MapperStore(playersStore, createPlayerResourcePanel);
  const { $root, swipes } = createPanel(currentPlayerStore, panelsStore);
  swipes.on((index) => currentPlayerStore.set(index));

  const render = () => {
    docTitle.setTitle("Resources");
    top.updateTitle("Player's resources");
    app.topSlot.attach(top.$root);
    app.contentSlot.attach($root);
    app.render();
  };

  return { $root, render };
}

export const resourcesViewDependency = defineDependency<View>({
  provider: provideResourcesView,
  scope: controllerScopeContract,
});
