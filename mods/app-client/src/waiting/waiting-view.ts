import { Player } from "../../../common/player/player.layout.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { createEditBox } from "../edit-box.ts";
import { button, div, div_nodes } from "@acme/dom/nodes.ts";
import { AppView, appViewDependency } from "../app/app-view.ts";
import { frontendScopeContract } from "../../bootstrap.ts";
import { DocTitle, docTitleDependency } from "../app/doc-title.ts";
import { ClientGame, clientGameDependency } from "../game/game-manager.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { myPlayerDependency } from "../player/my-player.ts";

export class WaitingPlayerFactory {
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

// export function provideWaitingPlayersCollection() {
//   return new Collection<Player>([]);
// }

export class WaitingView {
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly app: AppView,
    private readonly docTitle: DocTitle,
    private readonly game: ClientGame,
    private readonly myPlayer: Player,
    // players: Collection<Player>,
    // private readonly modalManager: ModalManager,
    // private readonly quitGameChannel: Channel<null>,
    // private readonly playerDataUpdater: PlayerUpdater,
    // private readonly gameStarter: GameStarter,
  ) {
    const gameIdBox = createEditBox({
      caption: "GameID",
      name: "gameId",
      placeholder: "GameID",
    });
    gameIdBox.$input.readOnly = true;
    gameIdBox.$input.value = game.gameId;

    const $change = button("box _action", "Change name or color...");
    const $quitGame = button("box _action", "Quit game");
    const $start = button("box _action", "Start game");

    const $loop = div("waiting_players");
    // new Loop<Player>($loop, players, new WaitingPlayerFactory());

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
          ...(myPlayer.isAdmin ? [$start] : []),
        ]),
        div_nodes("space_container", [
          div("space_caption", "Joining players:"),
          $loop,
        ]),
      ]),
    ]);

    // onClick($quitGame, () => {
    //   this.whenQuidGameClicked();
    // });
    // onClick($change, () => {
    //   this.whenChanged();
    // });
    // onClick($start, () => {
    //   this.gameStarter.modal();
    // });
  }

  public render() {
    this.docTitle.setTitle("Waiting");
    this.app.contentSlot.attach(this.$root);
    this.app.render();
  }

  // protected async whenQuidGameClicked() {
  //   const modal = createQuitGameModal();
  //   this.modalManager.mount(modal);
  //   const result = await modal.promise;
  //   if (result.type === "cancel") {
  //     return;
  //   }
  //   this.quitGameChannel.emit(result.value);
  // }

  // protected async whenChanged() {
  //   const modal = createPlayerModal(this.player);
  //   this.modalManager.mount(modal);
  //   const result = await modal.promise;
  //   if (result.type === "cancel") {
  //     return;
  //   }
  //   this.playerDataUpdater.updatePlayer(result.value);
  // }
}

export function provideWaitingView(resolver: DependencyResolver) {
  return new WaitingView(
    resolver.resolve(appViewDependency),
    resolver.resolve(docTitleDependency),
    resolver.resolve(clientGameDependency),
    resolver.resolve(myPlayerDependency),
    // resolver.resolve(clientGameContextDependency),
    // resolver.resolve(playerDependency),
    // resolver.resolve(waitingPlayersCollectionDependency),
    // resolver.resolve(modalManagerDependency),
    // resolver.resolve(quitGameChannelDependency),
    // resolver.resolve(playerUpdaterDependency),
    // resolver.resolve(gameStarterDependency),
  );
}

export const waitingViewDependency = defineDependency({
  name: "waiting-view",
  provider: provideWaitingView,
  scope: frontendScopeContract,
});
