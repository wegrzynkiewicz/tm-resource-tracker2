import { onClick } from "../../../app-client/src/common.ts";
import { div_nodes, div_text } from "../../../core/frontend-framework/dom.ts";
import { withResolvers } from "../../../core/useful.ts";
import { createEditBox } from "../../../app-client/src/edit-box.ts";
import { ModalResponse } from "../../../app-client/src/modal.ts";
import { createColorSelectorBox } from "../../color/color-selector.ts";
import { assertColor } from "../../color/color.ts";
import { assertRequiredString } from "../../../core/asserts.ts";
import { JoinGame } from "./common.ts";

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
  const colorBox = createColorSelectorBox();
  const $cancel = div_text("box _button", "Cancel");
  const $join = div_text("box _button", "Join");

  const $root = div_nodes("modal", [
    div_nodes("modal_container", [
      div_text("modal_title", "Type game ID and your details:"),
      gameBox.$root,
      nameBox.$root,
      colorBox.$root,
      div_nodes("modal_buttons", [
        $cancel,
        $join,
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<JoinGame>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($join, () => {
    const gameId = gameBox.$input.value;
    const name = nameBox.$input.value;
    const color = colorBox.store.getValue().key;
    assertColor(color, "color-must-be-valid-key");
    assertRequiredString(name, "name-must-be-required-string");
    assertRequiredString(gameId, "game-id-must-be-required-string");
    const value: JoinGame = { color, gameId, name };
    resolve({
      type: "confirm",
      value,
    });
  });

  return { promise, $root };
}
