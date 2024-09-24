import { DependencyResolver } from "@acme/dependency/service-resolver.ts";

import { Player, providePlayer } from "../player.layout.ts";
import { ClientGameContext, provideClientGameContext } from "../../game/client/context.ts";

import { createQuitGameModal, provideQuitGameChannel } from "../../game/quit/modal.ts";
import { ModalManager, provideModalManager } from "../../../app-client/src/modal.ts";
import { Channel } from "../../../core/channel.ts";
import { createPlayerModal } from "../update/player-modal.ts";
import { PlayerUpdater, providePlayerUpdater } from "../update/updater.ts";
import { createEditBox } from "../../../app-client/src/edit-box.ts";
import { GameStarter, provideGameStarter } from "../../game/start/starter.ts";
import { IntroAppView, provideIntroAppView } from "../../../app-client/src/app/app-view.ts";

export class WaitingPlayerFactory implements ComponentFactory<Player> {
  public create(player: Player): HTMLElement {
    const { name, color } = player;
    const $root = div_nodes("history _background", [
      div_nodes("history_header", [
        div(`player-cube _${color}`),
        div("history_name", name),
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
    private readonly gameStarter: GameStarter,
    private readonly app: IntroAppView,
  ) {
    const gameIdBox = createEditBox({
      caption: "GameID",
      name: "gameId",
      placeholder: "GameID",
    });
    gameIdBox.$input.readOnly = true;
    gameIdBox.$input.value = gameContext.identifier.gameId;

    const $change = button("box _action", "Change name or color...");
    const $quitGame = button("box _action", "Quit game");
    const $start = button("box _action", "Start game");

    const $loop = div("waiting_players");
    new Loop<Player>($loop, players, new WaitingPlayerFactory());

    this.$root = div_nodes("waiting", [
      div_nodes("space", [
        div_nodes("space_container", [
          div("space_caption", "Waiting for players..."),
          gameIdBox.$root,
        ]),
        div_nodes("space_container", [
          div("space_caption", "You can also..."),
          $change,
          $quitGame,
          ...(player.isAdmin ? [$start] : []),
        ]),
        div_nodes("space_container", [
          div("space_caption", "Joining players:"),
          $loop,
        ]),
      ]),
    ]);

    onClick($quitGame, () => {
      this.whenQuidGameClicked();
    });
    onClick($change, () => {
      this.whenChanged();
    });
    onClick($start, () => {
      this.gameStarter.modal();
    });
  }

  public render() {
    this.app.render(this.$root);
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

export function provideWaitingView(resolver: DependencyResolver) {
  return new WaitingView(
    resolver.resolve(clientGameContextDependency),
    resolver.resolve(playerDependency),
    resolver.resolve(waitingPlayersCollectionDependency),
    resolver.resolve(modalManagerDependency),
    resolver.resolve(quitGameChannelDependency),
    resolver.resolve(playerUpdaterDependency),
    resolver.resolve(gameStarterDependency),
    resolver.resolve(introAppViewDependency),
  );
}
