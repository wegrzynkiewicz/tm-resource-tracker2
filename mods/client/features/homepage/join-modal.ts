import { onClick } from "../common.ts";
import { div_nodes, div_text, label_props } from "../../../frontend-framework/dom.ts";
import { createSelector } from "../selector.ts";
import { withResolvers } from "../../../common/useful.ts";
import { colors } from "../../../common/colors.ts";
import { createEditBox } from "../../common/edit-box.ts";

export interface JoinModalConfirmResponse {
  type: "confirm";
  value: {
    player: {
      name: string;
      color: string;
    };
    gameId: string;
  };
}

export interface JoinModalCancelResponse {
  type: "cancel";
}

export type JoinModalResponse = JoinModalConfirmResponse | JoinModalCancelResponse;

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

  const { promise, resolve } = withResolvers<JoinModalResponse>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($join, () => {
    resolve({
      type: "confirm",
      value: {
        player: {
          name: "John",
          color: "red",
        },
        gameId: "12345",
      },
    });
  });

  return { promise, $root };
}
