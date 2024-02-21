import { onClick } from "../common.ts";
import { button_text, div_nodes } from "../../../frontend-framework/dom.ts";
import { createJoinModal } from "./join-modal.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { CreateGame, JoinGame } from "../game/source.ts";
import { provideJoinGameChannel, provideCreateGameChannel } from "../game/source.ts";
import { Channel } from "../../../common/channel.ts";
import { ModalManager, provideModalManager } from "../modal.ts";
import { createPlayerDataModal } from "../player-data-updates/modal.ts";

export class HomepageView {
  public readonly $root: HTMLDivElement;
  public constructor(
    private readonly modalManager: ModalManager,
    private readonly createGameChannel: Channel<CreateGame>,
    private readonly joinGameChannel: Channel<JoinGame>,
  ) {
    const $create = button_text("box _action", "New Game");
    const $join = button_text("box _action", "Join the Game");
    const $about = button_text("box _action", "About");
    this.$root = div_nodes("homepage", [
      $create,
      $join,
      $about,
    ]);

    onClick($create, () => this.whenCreateGameClicked());
    onClick($join, () => this.whenJoinGameClicked());
  }

  protected async whenCreateGameClicked() {
    const modal = createPlayerDataModal({
      colorKey: "",
      name: "",
    });
    this.modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
    this.createGameChannel.emit(result.value);
  }

  protected async whenJoinGameClicked() {
    const modal = createJoinModal();
    this.modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
    this.joinGameChannel.emit(result.value);
  }
}

export function provideHomepageView(resolver: ServiceResolver) {
  return new HomepageView(
    resolver.resolve(provideModalManager),
    resolver.resolve(provideCreateGameChannel),
    resolver.resolve(provideJoinGameChannel),
  );
}
