import { appState } from "../app.ts";
import { onClick } from "../../common.ts";
import { button_text, div_nodes } from "../../common/dom.ts";
import { createJoinModal } from "./join-modal.ts";
import { modalManager } from "../modal.ts";

export function createHomepage() {
  const $create = button_text("box _action", "New Game");
  const $join = button_text("box _action", "Join the Game");
  const $about = button_text("box _action", "About");
  const $root = div_nodes("homepage", [
    $create,
    $join,
    $about,
  ]);

  onClick($create, () => {
    appState.emit("work");
  });
  onClick($join, async () => {
    const modal =  createJoinModal();
    modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
  });
  return $root;
}
