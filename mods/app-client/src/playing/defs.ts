import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeToken } from "../defs.ts";
import { NumberStore } from "@acme/dom/number-store.ts";
import { PlayingView } from "./playing-view.layout.compiled.ts";
import { Channel } from "@acme/dom/channel.ts";

export function provideCurrentPlayerStore() {
  return new NumberStore();
}

export const currentPlayerStoreDependency = defineDependency({
  provider: provideCurrentPlayerStore,
  scopeToken: frontendScopeToken,
});

export class PlayingViewStore {
  public updates = new Channel<[]>();
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
  provider: providePlayingViewStore,
  scopeToken: frontendScopeToken,
});
