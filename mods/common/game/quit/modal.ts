import { Channel } from "../../../core/channel.ts";
import { createQuestionModal } from "../../../app-client/src/question-modal.ts";
import { defineDependency } from "@acme/dependency/injection.ts";

export function provideQuitGameChannel() {
  return new Channel<null>();
}
export const quitGameChannelDependency = defineDependency({
  kind: "quit-game-channel",
  provider: provideQuitGameChannel,
});

export function createQuitGameModal() {
  return createQuestionModal({
    titleText: "Do you want to quit the game?",
    confirmText: "Quit",
  });
}
