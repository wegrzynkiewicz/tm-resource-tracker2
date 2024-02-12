import { onClick } from "../common.ts";
import { button_text, div_nodes } from "../../../frontend-framework/dom.ts";
import { createJoinModal } from "./join-modal.ts";
import { modalManager } from "../modal.ts";
import { createCreationGameModal } from "./creation-modal.ts";
import { appState } from "../app/app.ts";

export class HomepageView {
  public readonly $root: HTMLDivElement;
  public constructor() {
    const $create = button_text("box _action", "New Game");
    const $join = button_text("box _action", "Join the Game");
    const $about = button_text("box _action", "About");
    this.$root = div_nodes("homepage", [
      $create,
      $join,
      $about,
    ]);

    onClick($create, () => this.whenCreateGameClicked());
    onClick($join, () => this.whenJoinGameClicked());
  }

  protected async whenCreateGameClicked() {
    const modal = createCreationGameModal();
    modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
    appState.emit("work");
  }

  protected async whenJoinGameClicked() {
    const modal = createJoinModal();
    modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
  }
}
