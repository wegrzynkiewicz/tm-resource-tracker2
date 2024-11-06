import { MapperStore } from "@acme/dom/mapper-store.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { docTitleDependency } from "../../app/doc-title.ts";
import { controllerScopeToken } from "../../defs.ts";
import { playingAppViewDependency } from "../playing-app-view.ts";
import { playingTopDependency } from "../playing-top.ts";
import { createResourcePanel } from "./resource-item.ts";
import { modalManagerDependency } from "../../modal.ts";
import { createPanel } from "../../app/panel.ts";
import { playersStoreDependency } from "../../player/players-store.ts";
import { currentPlayerStoreDependency } from "../defs.ts";
import { ResourceStore } from "@common/resources/defs.ts";
import { Context } from "@acme/dependency/context.ts";

export function provideResourcesView(context: Context) {
  const app = context.resolve(playingAppViewDependency);
  const top = context.resolve(playingTopDependency);
  const modalManager = context.resolve(modalManagerDependency);
  const docTitle = context.resolve(docTitleDependency);
  const playersStore = context.resolve(playersStoreDependency);
  const currentPlayerStore = context.resolve(currentPlayerStoreDependency);

  const createPlayerResourcePanel = () => {
    const store = new ResourceStore();
    const { $root } = createResourcePanel(store, modalManager);
    return $root;
  };

  const panelsStore = new MapperStore(playersStore, createPlayerResourcePanel);
  const panel = createPanel(currentPlayerStore, panelsStore);
  panel.swipes.on((index) => currentPlayerStore.set(index));

  const $root = panel.$root;

  const render = () => {
    docTitle.setTitle("Resources");
    top.updateTitle("Player's resources");
    app.topSlot.attach(top.$root);
    app.contentSlot.attach(panel.$root);
    app.render();
  };

  const dispose = () => {
    panelsStore.dispose();
    panel.dispose();
  };

  return { $root, dispose, render };
}

export const resourcesViewDependency = defineDependency({
  provider: provideResourcesView,
  scopeToken: controllerScopeToken,
});
