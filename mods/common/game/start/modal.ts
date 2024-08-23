import { createQuestionModal } from "../../../app-client/src/question-modal.ts";

export function createStartGameModal() {
  return createQuestionModal({
    titleText: "Do you want to start the game?",
    confirmText: "Start",
  });
}
