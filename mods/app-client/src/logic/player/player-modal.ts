import { div, div_nodes, form_nodes } from "@acme/dom/nodes.ts";
import { unwrapLayoutResult } from "@acme/layout/runtime/mod.ts";
import { Result } from "@acme/useful/result.ts";
import { GameCreateC2SReqDTO, parseGameCreateC2SReqDTO } from "@common/game/game-create-c2s-req-dto.layout.compiled.ts";
import { createColorSelectorBox } from "../../frontend/utils/color-selector.ts";
import { createEditBox } from "../../frontend/utils/edit-box.ts";
import { deferred } from "@acme/useful/async.ts";

export function createPlayerModal() {
  const nameBox = createEditBox({
    caption: "Name",
    name: "name",
    placeholder: "Your name",
  });
  const colorBox = createColorSelectorBox();
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

  const defer = deferred<Result<GameCreateC2SReqDTO, null>>();

  $cancel.addEventListener("click", () => {
    defer.resolve([false, null]);
  });

  $create.addEventListener("click", () => {
    const payload = {
      name: nameBox.$input.value,
      color: colorBox.selector.getValue()?.key,
    }
    const result = parseGameCreateC2SReqDTO(payload);
    const value = unwrapLayoutResult(result, "invalid-player");
    defer.resolve([true, value]);
  });

  return { $root, ready: defer.promise };
}
