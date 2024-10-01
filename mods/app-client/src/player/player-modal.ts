import { createEditBox } from "../../../app-client/src/edit-box.ts";
import { div, div_nodes, form_nodes } from "@acme/dom/nodes.ts";
import { unwrapLayoutResult } from "@acme/layout/runtime/mod.ts";
import { Result } from "@acme/useful/result.ts";
import { createColorSelectorBox } from "../helpers/color-selector.ts";
import {
  GameCreateC2SReqDTO,
  parseGameCreateC2SReqDTO,
} from "../../../common/game/game-create-c2s-req-dto.layout.compiled.ts";

export function createPlayerModal() {
  const nameBox = createEditBox({
    caption: "Name",
    name: "name",
    placeholder: "Your name",
  });
  const colorBox = createColorSelectorBox("color");
  const $cancel = div("box _button", "Cancel");
  const $create = div("box _button", "Create");

  const $root = form_nodes("modal", [
    div_nodes("modal_container", [
      div("modal_title", "Type your name and choose a color:"),
      nameBox.$root,
      colorBox.$root,
      div_nodes("modal_buttons", [
        $cancel,
        $create,
      ]),
    ]),
  ]);

  const defer = Promise.withResolvers<Result<GameCreateC2SReqDTO, null>>();

  $cancel.addEventListener("click", () => {
    defer.resolve([false, null]);
  });

  $create.addEventListener("click", () => {
    const data = new FormData($root);
    const payload = Object.fromEntries(data);
    const result = parseGameCreateC2SReqDTO(payload);
    const value = unwrapLayoutResult(result, "invalid-player-name");
    defer.resolve([true, value]);
  });

  return { $root, ready: defer.promise };
}
