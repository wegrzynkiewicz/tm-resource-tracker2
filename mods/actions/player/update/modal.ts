import { assertRequiredString } from "../../../common/asserts.ts";
import { withResolvers } from "../../../common/useful.ts";
import { assertColor } from "../../color/color.ts";
import { PlayerUpdateDTO } from "../common.ts";
import { div_text, form, div_nodes } from "../../../common/frontend-framework/dom.ts";
import { createColorSelectorBox } from "../../color/color-selector.ts";
import { createEditBox } from "../../../apps/client/edit-box.ts";
import { onClick } from "../../../apps/client/features/common.ts";
import { ModalResponse } from "../../../apps/client/features/modal.ts";

export type PlayerModalResponse = PlayerUpdateDTO;

export function createPlayerModal(input?: PlayerUpdateDTO) {
  const { name, color } = input ?? {};
  const nameBox = createEditBox({
    label: "Name",
    name: "name",
    placeholder: "Your name",
  });
  nameBox.$input.value = name ?? '';
  const colorBox = createColorSelectorBox();
  color && colorBox.store.setValue(color);
  const $cancel = div_text("box _button", "Cancel");
  const $create = div_text("box _button", "Create");

  const $root = form({ className: "modal" }, [
    div_nodes("modal_container", [
      div_text("modal_title", "Type your name and choose a color:"),
      nameBox.$root,
      colorBox.$root,
      div_nodes("modal_buttons", [
        $cancel,
        $create,
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<PlayerModalResponse>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($create, () => {
    const name = nameBox.$input.value;
    const color = colorBox.store.getValue().key;
    assertColor(color, "color-must-be-valid-key");
    assertRequiredString(name, "name-must-be-required-string");
    const value: PlayerModalResponse = { color, name };
    resolve({
      type: "confirm",
      value,
    });
  });

  return { promise, $root };
}
