import { defineDependency } from "@acme/dependency/declaration.ts";
import { createEditBox } from "../edit-box.ts";
import { button, div, div_nodes } from "@acme/dom/nodes.ts";
import { appViewDependency } from "../app/app-view.ts";
import { frontendScopeContract } from "../../defs.ts";
import { docTitleDependency } from "../app/doc-title.ts";
import { myPlayerDependency } from "../player/my-player.ts";
import { PlayerDTO } from "../../../common/player/player.layout.compiled.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { homePath } from "../home/home-defs.ts";
import { createQuestionModal, modalManagerDependency } from "../modal.ts";
import { PlayerModal } from "../../../common/player/update/player-modal.ts";
import { clientGameContextManagerDependency, clientGameIdDependency } from "../game/client-game-context.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export class WaitingPlayerFactory {
  public create(player: PlayerDTO): HTMLElement {
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

// export class WaitingView {
//   public readonly $root: HTMLDivElement;

//   public constructor(
//     private readonly app: AppView,
//     private readonly docTitle: DocTitle,
//     private readonly gameId: string,
//     private readonly myPlayer: PlayerDTO,
//     private readonly manager: ClientGameContextManager,
//     private readonly controllerRunner: ControllerRunner,
//     // players: Collection<Player>,
//     // private readonly modalManager: ModalManager,
//     // private readonly quitGameChannel: Channel<null>,
//     // private readonly playerDataUpdater: PlayerUpdater,
//     // private readonly gameStarter: GameStarter,
//   ) {
//     const gameIdBox = createEditBox({
//       caption: "GameID",
//       name: "gameId",
//       placeholder: "GameID",
//     });
//     gameIdBox.$input.readOnly = true;
//     gameIdBox.$input.value = game.gameId;

//     const $change = button("box _action", "Change name or color...");
//     const $quitGame = button("box _action", "Quit game");
//     const $start = button("box _action", "Start game");

//     const $loop = div("waiting_players");
//     // new Loop<Player>($loop, players, new WaitingPlayerFactory());

//     this.$root = div_nodes("waiting", [
//       div_nodes("space", [
//         div_nodes("space_container", [
//           div("space_caption", "Waiting for players..."),
//           gameIdBox.$root,
//         ]),
//         div_nodes("space_container", [
//           div("space_caption", "You can also..."),
//           $change,
//           $quitGame,
//           ...(myPlayer.isAdmin ? [$start] : []),
//         ]),
//         div_nodes("space_container", [
//           div("space_caption", "Joining players:"),
//           $loop,
//         ]),
//       ]),
//     ]);

//     $quitGame.addEventListener("click", async () => {
//       await this.manager.quitClientGame();
//       await this.controllerRunner.run(homePath);
//     });

//     // onClick($quitGame, () => {
//     //   this.whenQuidGameClicked();
//     // });
//     // onClick($change, () => {
//     //   this.whenChanged();
//     // });
//     // onClick($start, () => {
//     //   this.gameStarter.modal();
//     // });
//   }

//   public render() {
//     this.docTitle.setTitle("Waiting");
//     this.app.contentSlot.attach(this.$root);
//     this.app.render();
//   }

//   // protected async whenQuidGameClicked() {
//   //   const modal = createQuitGameModal();
//   //   this.modalManager.mount(modal);
//   //   const result = await modal.promise;
//   //   if (result.type === "cancel") {
//   //     return;
//   //   }
//   //   this.quitGameChannel.emit(result.value);
//   // }

//   // protected async whenChanged() {
//   //   const modal = createPlayerModal(this.player);
//   //   this.modalManager.mount(modal);
//   //   const result = await modal.promise;
//   //   if (result.type === "cancel") {
//   //     return;
//   //   }
//   //   this.playerDataUpdater.updatePlayer(result.value);
//   // }
// }

export function provideWaitingView(resolver: DependencyResolver) {
  const app = resolver.resolve(appViewDependency);
  const docTitle = resolver.resolve(docTitleDependency);
  const gameId = resolver.resolve(clientGameIdDependency);
  const myPlayer = resolver.resolve(myPlayerDependency);
  const modalManager = resolver.resolve(modalManagerDependency);
  const clientGameManager = resolver.resolve(clientGameContextManagerDependency);
  const controllerRunner = resolver.resolve(controllerRunnerDependency);

  const gameIdBox = createEditBox({
    caption: "GameID",
    name: "gameId",
    placeholder: "GameID",
  });
  gameIdBox.$input.readOnly = true;
  gameIdBox.$input.value = gameId;

  const $change = button("box _action", "Change name or color...");
  const $quitGame = button("box _action", "Quit game");
  const $start = button("box _action", "Start game");

  const $loop = div("waiting_players");
  // new Loop<Player>($loop, players, new WaitingPlayerFactory());

  const $root = div_nodes("waiting", [
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

  $change.addEventListener("click", async () => {
    const modal = new PlayerModal();
    await modalManager.mount(modal);
    const [status, data] = await modal.ready;
    if (status === true) {
      // await clientGameManager.updateClientPlayer(data);
    }
  });

  $quitGame.addEventListener("click", async () => {
    const modal = createQuestionModal({
      titleText: "Do you want to quit the game?",
      confirmText: "Quit",
    });
    await modalManager.mount(modal);
    const status = await modal.ready;
    if (status === true) {
      await clientGameManager.quitClientGame();
      await controllerRunner.run(homePath);
    }
  });

  const render = () => {
    docTitle.setTitle("Waiting");
    app.contentSlot.attach($root);
    app.render();
  };

  return { $root, render };
}

export const waitingViewDependency = defineDependency({
  name: "waiting-view",
  provider: provideWaitingView,
  scope: frontendScopeContract,
});
