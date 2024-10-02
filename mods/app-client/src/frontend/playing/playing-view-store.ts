import { defineDependency } from "@acme/dependency/declaration.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { PlayingView } from "./playing-view.layout.compiled.ts";
import { frontendScopeContract } from "../../../defs.ts";

export class PlayingViewStore {
  public updates = new Channel<[PlayingView]>();
  public view: PlayingView = "supplies";

  public update(view: PlayingView) {
    this.view = view;
    this.updates.emit(view);
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
