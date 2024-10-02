import { defineDependency } from "@acme/dependency/declaration.ts";
import { createEditBox } from "../edit-box.ts";
import { button, div, div_nodes } from "@acme/dom/nodes.ts";
import { appViewDependency } from "../app/app-view.ts";
import { frontendScopeContract } from "../../defs.ts";
import { docTitleDependency } from "../app/doc-title.ts";
import { myPlayerDependency } from "../player/my-player.ts";
import { PlayerDTO } from "../../../common/player/player-dto.layout.compiled.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { homePath } from "../home/home-defs.ts";
import { createQuestionModal, modalManagerDependency } from "../modal.ts";
import { clientGameContextManagerDependency, clientGameIdDependency } from "../game-context/client-game-context.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { playersStoreDependency } from "../player/players-store.ts";
import { createPlayerModal } from "../player/player-modal.ts";
import { normalCADispatcherDependency } from "@acme/control-action/normal/defs.ts";
import { gameCreateC2SNotNormalCA } from "../../../common/game/defs.ts";

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

export function provideWaitingView(resolver: DependencyResolver) {
  const app = resolver.resolve(appViewDependency);
  const docTitle = resolver.resolve(docTitleDependency);
  const gameId = resolver.resolve(clientGameIdDependency);
  const myPlayer = resolver.resolve(myPlayerDependency);
  const modalManager = resolver.resolve(modalManagerDependency);
  const clientGameManager = resolver.resolve(clientGameContextManagerDependency);
  const controllerRunner = resolver.resolve(controllerRunnerDependency);
  const playersStore = resolver.resolve(playersStoreDependency);
  const dispatcher = resolver.resolve(normalCADispatcherDependency);

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

  playersStore.updates.on(() => {
    const players = playersStore.players.map(createPlayer);
    $players.replaceChildren(...players);
  });

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
      dispatcher.dispatch(gameCreateC2SNotNormalCA, undefined);
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
