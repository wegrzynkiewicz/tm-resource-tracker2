import { onClick } from "../common.ts";
import { div_nodes, div_text } from "../../../frontend-framework/dom.ts";
import { withResolvers } from "../../../common/useful.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ModalResponse } from "../modal.ts";
import { createColorSelectorBox } from "../../common/color-selector.ts";

export interface JoinModalResponse {
  colorKey: string;
  gameId: string;
  name: string;
}

export function createJoinModal() {
  const gameBox = createEditBox({
    label: "Game ID",
    name: "gameId",
    placeholder: "Ask your friend",
  });
  const nameBox = createEditBox({
    label: "Name",
    name: "player-name",
    placeholder: "Your name",
  });
  const color = createColorSelectorBox();
  const $cancel = div_text("box _button", "Cancel");
  const $join = div_text("box _button", "Join");

  const $root = div_nodes("modal", [
    div_nodes("modal_background", [
      div_nodes("modal_container", [
        div_text("modal_title", "Type game ID and your details:"),
        gameBox.$root,
        nameBox.$root,
        color.$root,
        div_nodes("modal_buttons", [
          $cancel,
          $join,
        ]),
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<JoinModalResponse>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($join, () => {
    const gameId = gameBox.$input.value;
    const name = nameBox.$input.value;
    const colorKey = color.store.getValue().key;
    if (name === "" || gameId === "") {
      return;
    }
    const value: JoinModalResponse = { colorKey, gameId, name };
    resolve({
      type: "confirm",
      value,
    });
  });

  return { promise, $root };
}
