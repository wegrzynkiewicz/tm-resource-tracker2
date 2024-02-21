import { withResolvers } from "../../../common/useful.ts";
import { div_text, form, div_nodes } from "../../../frontend-framework/dom.ts";
import { PlayerDataUpdateDTO } from "../../../player/data.ts";
import { createColorSelectorBox } from "../../common/color-selector.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { onClick } from "../common.ts";
import { ModalResponse } from "../modal.ts";

export type PlayerDataModalResponse = PlayerDataUpdateDTO;

export function createPlayerDataModal(input: PlayerDataUpdateDTO) {
  const { name, colorKey } = input;
  const nameBox = createEditBox({
    label: "Name",
    name: "name",
    placeholder: "Your name",
  });
  nameBox.$input.value = name;
  const color = createColorSelectorBox();
  color.store.setValue(colorKey);
  const $cancel = div_text("box _button", "Cancel");
  const $create = div_text("box _button", "Create");

  const $root = form({ className: "modal" }, [
    div_nodes("modal_background", [
      div_nodes("modal_container", [
        div_text("modal_title", "Type your name and choose a color:"),
        nameBox.$root,
        color.$root,
        div_nodes("modal_buttons", [
          $cancel,
          $create,
        ]),
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<PlayerDataModalResponse>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($create, () => {
    const name = nameBox.$input.value;
    const colorKey = color.store.getValue().key;
    if (name === "") {
      return;
    }
    const value: PlayerDataModalResponse = { colorKey, name };
    resolve({
      type: "confirm",
      value,
    });
  });

  return { promise, $root };
}
