import { onClick } from "../common.ts";
import { div_nodes, div_text, label_props } from "../../../frontend-framework/dom.ts";
import { createSelector } from "../selector.ts";
import { withResolvers } from "../../../common/useful.ts";
import { colors } from "../../../common/colors.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ModalResponse } from "../modal.ts";

export interface CreationModalResponse {
  colorKey: string;
  gameId: string;
  name: string;
}

export function createJoinModal() {
  const $cancel = div_text("box _button", "Cancel");
  const $join = div_text("box _button", "Join");

  const $root = div_nodes("modal", [
    div_nodes("modal_background", [
      div_nodes("modal_container", [
        div_text("modal_title", "Type game ID and your details:"),
        createEditBox({
          label: "Game ID",
          name: "gameId",
          placeholder: "Ask your friend",
        }).$root,
        createEditBox({
          label: "Name",
          name: "player-name",
          placeholder: "Your name",
        }).$root,
        div_nodes("edit-box _selector", [
          label_props({
            className: "edit-box_label",
            for: "player-color",
            textContent: "Color",
          }),
          createSelector(colors).$root,
        ]),
        div_nodes("modal_buttons", [
          $cancel,
          $join,
        ]),
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<CreationModalResponse>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($join, () => {
    resolve({
      type: "confirm",
      value: {
        colorKey: "red",
        gameId: "12345",
        name: "John",
      },
    });
  });

  return { promise, $root };
}
