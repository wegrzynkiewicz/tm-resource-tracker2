import { createQuestionModal } from "../../../apps/client/question-modal.ts";

export function createStartGameModal() {
  return createQuestionModal({
    titleText: "Do you want to start the game?",
    confirmText: "Start",
  });
}
