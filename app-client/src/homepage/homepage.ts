import { onClick } from "../common.ts";
import { button_text, div_nodes } from "../../../core/frontend-framework/dom.ts";
import { createJoinModal } from "../../../common/game/join/modal.ts";
import { ServiceResolver } from "../../../core/dependency.ts";
import { provideJoinGameChannel, provideCreateGameChannel } from "../../../common/game/client/source.ts";
import { Channel } from "../../../core/channel.ts";
import { ModalManager, provideModalManager } from "../modal.ts";
import { createPlayerModal } from "../../../common/player/update/modal.ts";
import { PlayerUpdateDTO } from "../../../common/player/common.ts";
import { JoinGame } from "../../../common/game/join/common.ts";
import { provideIntroAppView } from "../../../common/page/intro/intro-app.ts";
import { IntroAppView } from "../../../common/page/intro/intro-app.ts";
import { box } from "../../styles/box.module.css"; 

export class HomepageView {
  public readonly $root: HTMLDivElement;
  public constructor(
    private readonly app: IntroAppView,
    private readonly modalManager: ModalManager,
    private readonly createGameChannel: Channel<PlayerUpdateDTO>,
    private readonly joinGameChannel: Channel<JoinGame>,
  ) {
    const $create = button_text(`${box}`, "New Game");
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

  public render() {
    this.app.render(this.$root);
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
    resolver.resolve(provideIntroAppView),
    resolver.resolve(provideModalManager),
    resolver.resolve(provideCreateGameChannel),
    resolver.resolve(provideJoinGameChannel),
  );
}
