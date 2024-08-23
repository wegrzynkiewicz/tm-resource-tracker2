import { div_text, form, div_nodes } from "../../core/frontend-framework/dom.ts";
import { withResolvers } from "../../core/useful.ts";
import { onClick } from "./common.ts";
import { ModalResponse } from "./modal.ts";

export interface QuestionModalInput {
  titleText: string;
  confirmText?: string;
  cancelText?: string;
}

export function createQuestionModal(input: QuestionModalInput) {
  const {
    titleText,
    confirmText = "Confirm",
    cancelText = "Cancel"
  } = input;
  const $cancel = div_text("box _button", cancelText);
  const $confirm = div_text("box _button", confirmText);

  const $root = form({ className: "modal" }, [
    div_nodes("modal_container", [
      div_text("modal_title", titleText),
      div_nodes("modal_buttons", [
        $cancel,
        $confirm,
      ]),
    ]),
  ]);

  const { promise, resolve } = withResolvers<ModalResponse<null>>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($confirm, () => {
    resolve({ type: "confirm", value: null });
  });

  return { promise, $root };
}
