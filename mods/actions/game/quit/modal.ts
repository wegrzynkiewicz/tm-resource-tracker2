import { Channel } from "../../../common/channel.ts";
import { createQuestionModal } from "../../../apps/client/question-modal.ts";

export function provideQuitGameChannel() {
  return new Channel<null>();
}

export function createQuitGameModal() {
  return createQuestionModal({
    titleText: "Do you want to quit the game?",
    confirmText: "Quit",
  });
}
