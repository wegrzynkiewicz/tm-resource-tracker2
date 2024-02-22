import { onClick } from "../common.ts";
import { div_nodes, div_text } from "../../../../common/frontend-framework/dom.ts";
import { withResolvers } from "../../../../common/useful.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ModalResponse } from "../modal.ts";
import { createColorSelectorBox } from "../../common/color-selector.ts";
import { JoinGame } from "../../../../domain/game.ts";
import { assertColor } from "../../../../domain/colors.ts";
import { assertRequiredString } from "../../../../common/asserts.ts";

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
    div_nodes("modal_background", [
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
