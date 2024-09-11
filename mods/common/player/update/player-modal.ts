import { createColorSelectorBox } from "../../color/color-selector.ts";
import { createEditBox } from "../../../app-client/src/edit-box.ts";
import { Modal, ModalResponse } from "../../../app-client/src/modal.ts";
import { MyPlayerDTO, myPlayerUpdateLayout } from "../common.ts";
import { div, div_nodes, form_nodes } from "@acme/dom/nodes.ts";
import { parseUsingLayout } from "@acme/layout/common.ts";

export type PlayerModalResponse = MyPlayerDTO;

export class PlayerModal implements Modal<PlayerModalResponse> {
  public readonly $root: HTMLFormElement;
  public readonly defer = Promise.withResolvers<ModalResponse<PlayerModalResponse>>();

  public constructor() {
    const nameBox = createEditBox({
      caption: "Name",
      name: "name",
      placeholder: "Your name",
    });
    const colorBox = createColorSelectorBox("color");
    const $cancel = div("box _button", "Cancel");
    const $create = div("box _button", "Create");

    this.$root = form_nodes("modal", [
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

    $cancel.addEventListener("click", () => {
      this.defer.resolve({ type: "cancel" });
    });

    $create.addEventListener("click", () => {
      const data = new FormData(this.$root);
      const payload = Object.fromEntries(data);
      const value = parseUsingLayout(myPlayerUpdateLayout, payload).unwrap("invalid-player-data");
      this.defer.resolve({ type: "confirm", value });
    });
  }

  public get ready() {
    return this.defer.promise;
  }
}
