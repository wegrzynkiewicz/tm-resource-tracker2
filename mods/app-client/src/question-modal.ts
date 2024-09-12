import { withResolvers } from "../../core/useful.ts";
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
    cancelText = "Cancel",
  } = input;
  const $cancel = div("box _button", cancelText);
  const $confirm = div("box _button", confirmText);

  const $root = form({ className: "modal" }, [
    div_nodes("modal_container", [
      div("modal_title", titleText),
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
