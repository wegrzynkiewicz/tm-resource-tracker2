import { defineDependency } from "@framework/dependency/declaration.ts";
import { frontendScopeToken } from "../defs.ts";
import { NumberStore } from "@framework/dom/number-store.ts";
import { PlayingView } from "./playing-view.layout.compiled.ts";
import { Channel } from "@framework/dom/channel.ts";

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
