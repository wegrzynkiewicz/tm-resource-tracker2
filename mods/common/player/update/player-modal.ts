import { createColorSelectorBox } from "../../color/color-selector.ts";
import { createEditBox } from "../../../app-client/src/edit-box.ts";
import { Modal } from "../../../app-client/src/modal.ts";
import { div, div_nodes, form_nodes } from "@acme/dom/nodes.ts";
import { MyPlayerUpdate, parseMyPlayerUpdate } from "../player.layout.compiled.ts";
import { unwrapLayoutResult } from "@acme/layout/runtime/mod.ts";
import { Result } from "@acme/useful/result.ts";

export class PlayerModal implements Modal<MyPlayerUpdate> {
  public readonly $root: HTMLFormElement;
  public readonly defer = Promise.withResolvers<Result<MyPlayerUpdate, null>>();

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
      this.defer.resolve([false, null]);
    });

    $create.addEventListener("click", () => {
      const data = new FormData(this.$root);
      const payload = Object.fromEntries(data);
      const result = parseMyPlayerUpdate(payload);
      const value = unwrapLayoutResult(result, "invalid-player-name");
      this.defer.resolve([true, value]);
    });
  }

  public get ready() {
    return this.defer.promise;
  }
}
