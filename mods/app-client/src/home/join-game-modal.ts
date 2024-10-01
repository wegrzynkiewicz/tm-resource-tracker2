import { div, div_nodes, form_nodes } from "@acme/dom/nodes.ts";
import { createEditBox } from "../edit-box.ts";
import { createColorSelectorBox } from "../helpers/color-selector.ts";
import { Result } from "@acme/useful/result.ts";
import { GameJoinC2SReqDTO, parseGameJoinC2SReqDTO } from "../../../common/game/game-join-c2s-req-dto.layout.compiled.ts";
import { unwrapLayoutResult } from "@acme/layout/runtime/defs.ts";

export function createJoinModal() {
  const gameBox = createEditBox({
    caption: "Game ID",
    name: "gameId",
    placeholder: "Ask your friend",
  });
  const nameBox = createEditBox({
    caption: "Name",
    name: "name",
    placeholder: "Your name",
  });
  const colorBox = createColorSelectorBox("color");
  const $cancel = div("box _button", "Cancel");
  const $join = div("box _button", "Join");

  const $root = form_nodes("modal", [
    div_nodes("modal_container", [
      div("modal_title", "Type game ID and your details:"),
      gameBox.$root,
      nameBox.$root,
      colorBox.$root,
      div_nodes("modal_buttons", [
        $cancel,
        $join,
      ]),
    ]),
  ]);

  const defer = Promise.withResolvers<Result<GameJoinC2SReqDTO, null>>();

  $cancel.addEventListener("click", () => {
    defer.resolve([false, null]);
  });

  $join.addEventListener("click", () => {
    const data = new FormData($root);
    const payload = Object.fromEntries(data);
    const result = parseGameJoinC2SReqDTO(payload);
    const value = unwrapLayoutResult(result, "invalid-player-name");
    defer.resolve([true, value]);
  });

  return { $root, ready: defer.promise };
}