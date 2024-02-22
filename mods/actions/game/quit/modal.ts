import { onClick } from "../../../apps/client/features/common.ts";
import { div_nodes, div_text, form } from "../../../common/frontend-framework/dom.ts";
import { withResolvers } from "../../../common/useful.ts";
import { ModalResponse } from "../../../apps/client/features/modal.ts";
import { Channel } from "../../../common/channel.ts";

export function provideQuitGameChannel() {
  return new Channel<null>();
}

export function createQuitGameModal() {
  const $cancel = div_text("box _button", "Cancel");
  const $quit = div_text("box _button", "Quit");

  const $root = form({ className: "modal" }, [
    div_nodes("modal_background", [
      div_nodes("modal_container", [
        div_text("modal_title", "Do you want to quit the game?"),
        div_nodes("modal_buttons", [
          $cancel,
          $quit,
        ]),
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<null>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($quit, () => {
    resolve({ type: "confirm", value: null });
  });

  return { promise, $root };
}
