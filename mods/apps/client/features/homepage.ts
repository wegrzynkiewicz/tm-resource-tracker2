import { onClick } from "./common.ts";
import { button_text, div_nodes } from "../../../common/frontend-framework/dom.ts";
import { createJoinModal } from "../../../actions/game/join/modal.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { provideJoinGameChannel, provideCreateGameChannel } from "../../../actions/game/client/source.ts";
import { Channel } from "../../../common/channel.ts";
import { ModalManager, provideModalManager } from "./modal.ts";
import { createPlayerModal } from "../../../actions/player/update/modal.ts";
import { PlayerUpdateDTO } from "../../../actions/player/common.ts";
import { JoinGame } from "../../../actions/game/join/common.ts";

export class HomepageView {
  public readonly $root: HTMLDivElement;
  public constructor(
    private readonly modalManager: ModalManager,
    private readonly createGameChannel: Channel<PlayerUpdateDTO>,
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
    const modal = createPlayerModal();
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
