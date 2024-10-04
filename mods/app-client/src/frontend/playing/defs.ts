import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { NumberStore } from "@acme/dom/number-store.ts";
import { Signal } from "@acme/dom/signal.ts";
import { PlayingView } from "./playing-view.layout.compiled.ts";

export function provideCurrentPlayerStore() {
  return new NumberStore();
}

export const currentPlayerStoreDependency = defineDependency({
  name: "current-player-store",
  provider: provideCurrentPlayerStore,
  scope: frontendScopeContract,
});

export class PlayingViewStore {
  public updates = new Signal();
  public view: PlayingView = "resources";

  public set(view: PlayingView) {
    this.view = view;
    this.updates.emit();
  }
}

export function providePlayingViewStore() {
  return new PlayingViewStore();
}

export const playingViewStoreDependency = defineDependency({
  name: "playing-view-store",
  provider: providePlayingViewStore,
  scope: frontendScopeContract,
});
