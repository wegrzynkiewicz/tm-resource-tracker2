import { defineDependency } from "@acme/dependency/declaration.ts";
import { createEditBox } from "../utils/edit-box.ts";
import { button, div, div_nodes } from "@acme/dom/nodes.ts";
import { introAppViewDependency } from "../app/intro-app-view.ts";
import { controllerScopeContract } from "../../../defs.ts";
import { docTitleDependency } from "../app/doc-title.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { controllerRunnerDependency } from "../../controller.ts";
import { createQuestionModal, modalManagerDependency } from "../../modal.ts";
import { clientGameContextManagerDependency, clientGameIdDependency } from "../../logic/game/client-game-context.ts";
import { normalCADispatcherDependency } from "@acme/control-action/normal/defs.ts";
import { gameStartC2SNotNormalCAContract } from "@common/game/defs.ts";
import { myPlayerDependency } from "../../logic/player/my-player.ts";
import { createPlayerModal } from "../../logic/player/player-modal.ts";
import { playersStoreDependency } from "../../logic/player/players-store.ts";
import { homePath } from "../routes.ts";

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

function createPlayer(player: PlayerDTO): HTMLElement {
  const { name, color } = player;
  const $root = div_nodes("history _background", [
    div_nodes("history_header", [
      div(`player-cube _${color}`),
      div("history_name", name),
    ]),
  ]);
  return $root;
}

export function provideWaitingView(context: Context) {
  const app = context.resolve(introAppViewDependency);
  const docTitle = context.resolve(docTitleDependency);
  const gameId = context.resolve(clientGameIdDependency);
  const myPlayer = context.resolve(myPlayerDependency);
  const modalManager = context.resolve(modalManagerDependency);
  const clientGameManager = context.resolve(clientGameContextManagerDependency);
  const controllerRunner = context.resolve(controllerRunnerDependency);
  const playersStore = context.resolve(playersStoreDependency);
  const dispatcher = context.resolve(normalCADispatcherDependency);

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
  const $players = div("waiting_players");

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
        $players,
      ]),
    ]),
  ]);

  const updatePlayers = () => {
    const players = playersStore.items.map(createPlayer);
    $players.replaceChildren(...players);
  };
  playersStore.updates.on(updatePlayers);
  updatePlayers();

  $change.addEventListener("click", async () => {
    const modal = createPlayerModal();
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

  $start.addEventListener("click", async () => {
    const modal = createQuestionModal({
      titleText: "Do you want to start the game?",
      confirmText: "Start",
    });
    await modalManager.mount(modal);
    const status = await modal.ready;
    if (status === true) {
      dispatcher.dispatch(gameStartC2SNotNormalCAContract, undefined);
    }
  });

  const render = () => {
    docTitle.setTitle("Waiting");
    app.contentSlot.attach($root);
    app.render();
  };

  const dispose = () => {
    playersStore.updates.off(updatePlayers);
  };

  return { $root, dispose, render };
}

export const waitingViewDependency = defineDependency({
  provider: provideWaitingView,
  scope: controllerScopeContract,
});
