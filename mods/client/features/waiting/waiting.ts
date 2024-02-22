import { ServiceResolver } from "../../../common/dependency.ts";
import { button_text, div_empty, div_nodes, div_text } from "../../../frontend-framework/dom.ts";
import { Player, providePlayer } from "../../../domain/player.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ClientGameContext, provideClientGameContext } from "../game/context.ts";
import { Collection } from "../../../frontend-framework/store.ts";
import { ComponentFactory, Loop } from "../../../frontend-framework/loop.ts";
import { onClick } from "../common.ts";
import { createQuitGameModal, provideQuitGameChannel } from "../quit-modal.ts";
import { ModalManager, provideModalManager } from "../modal.ts";
import { Channel } from "../../../common/channel.ts";
import { createPlayerModal } from "../player-data-updates/modal.ts";
import { PlayerUpdater, providePlayerUpdater } from "../player-data-updates/service.ts";

export class WaitingPlayerFactory implements ComponentFactory<Player> {
  public create(player: Player): HTMLElement {
    const { name, color } = player;
    const $root = div_nodes("history _background", [
      div_nodes("history_header", [
        div_empty(`player-cube _${color}`),
        div_text("history_name", name),
      ]),
    ]);
    return $root;
  }
}

export function provideWaitingPlayersCollection() {
  return new Collection<Player>([]);
}

export class WaitingView {
  public readonly $root: HTMLDivElement;

  public constructor(
    gameContext: ClientGameContext,
    private readonly player: Player,
    players: Collection<Player>,
    private readonly modalManager: ModalManager,
    private readonly quitGameChannel: Channel<null>,
    private readonly playerDataUpdater: PlayerUpdater,
  ) {
    const gameIdBox = createEditBox({
      label: "GameID",
      name: "gameId",
      placeholder: "GameID",
    });
    gameIdBox.$input.readOnly = true;
    gameIdBox.$input.value = gameContext.identifier.gameId;

    const $change = button_text("box _action", "Change name or color...");
    const $quitGame = button_text("box _action", "Quit game");
    const $start = button_text("box _action", "Start game");

    const $loop = div_empty("waiting_players");
    new Loop<Player>($loop, players, new WaitingPlayerFactory());

    this.$root = div_nodes("waiting", [
      div_nodes("space", [
        div_nodes("space_container", [
          div_text("space_caption", "Waiting for players..."),
          gameIdBox.$root,
        ]),
        div_nodes("space_container", [
          div_text("space_caption", "You can also..."),
          $change,
          $quitGame,
          ...(player.isAdmin ? [$start] : []),
        ]),
        div_nodes("space_container", [
          div_text("space_caption", "Joining players:"),
          $loop,
        ]),
      ]),
    ]);

    onClick($quitGame, () => { this.whenQuidGameClicked(); })
    onClick($change, () => { this.whenChanged(); })
  }

  protected async whenQuidGameClicked() {
    const modal = createQuitGameModal();
    this.modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
    this.quitGameChannel.emit(result.value);
  }

  protected async whenChanged() {
    const modal = createPlayerModal(this.player);
    this.modalManager.mount(modal);
    const result = await modal.promise;
    if (result.type === "cancel") {
      return;
    }
    this.playerDataUpdater.updatePlayer(result.value);
  }
}

export function provideWaitingView(resolver: ServiceResolver) {
  return new WaitingView(
    resolver.resolve(provideClientGameContext),
    resolver.resolve(providePlayer),
    resolver.resolve(provideWaitingPlayersCollection),
    resolver.resolve(provideModalManager),
    resolver.resolve(provideQuitGameChannel),
    resolver.resolve(providePlayerUpdater),
  );
}
