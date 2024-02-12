import { onClick } from "../common.ts";
import { div_nodes, div_text, form } from "../../../frontend-framework/dom.ts";
import { withResolvers } from "../../../common/useful.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ModalResponse } from "../modal.ts";
import { createColorSelectorBox } from "../../common/color-selector.ts";

export interface CreationModalResponse {
  colorKey: string;
  name: string;
}

export function createCreationGameModal() {
  const name = createEditBox({
    label: "Name",
    name: "name",
    placeholder: "Your name",
  });
  const color = createColorSelectorBox();
  const $cancel = div_text("box _button", "Cancel");
  const $create = div_text("box _button", "Create");

  const $root = form({ className: "modal" }, [
    div_nodes("modal_background", [
      div_nodes("modal_container", [
        div_text("modal_title", "Type your name and choose a color:"),
        name.$root,
        color.$root,
        div_nodes("modal_buttons", [
          $cancel,
          $create,
        ]),
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<CreationModalResponse>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($create, () => {
    const value: CreationModalResponse = {
      name: name.$input.value,
      colorKey: color.store.getValue().key,
    };
    resolve({
      type: "confirm",
      value,
    });
  });

  return { promise, $root };
}
