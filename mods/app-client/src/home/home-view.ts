import { AppView, appViewDependency } from "../app/app-view.ts";
import { defineDependency, DependencyResolver } from "@acme/dependency/injection.ts";
import { button, div_nodes } from "@acme/dom/nodes.ts";
import { IntroTop, introTopDependency } from "../app/intro-top.ts";
import { PlayerModal } from "../../../common/player/update/player-modal.ts";
import { ModalManager, modalManagerDependency } from "../modal.ts";
import { ActionDispatcher, actionDispatcherDependency } from "../actions.ts";
import { gameCreateActionContract } from "./game-create-action.ts";
import { frontendScopeContract } from "../../bootstrap.ts";

export class HomeView {
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly actionDispatcher: ActionDispatcher,
    private readonly app: AppView,
    private readonly modalManager: ModalManager,
    private readonly top: IntroTop,
  ) {
    const $create = button(`box _action`, "New Game");
    const $join = button("box _action", "Join the Game");
    const $about = button("box _action", "About");
    this.$root = div_nodes("homepage", [
      $create,
      $join,
      $about,
    ]);

    $create.addEventListener("click", async () => {
      const modal = new PlayerModal();
      this.modalManager.mount(modal);
      const result = await modal.ready;
      if (result.type === "confirm") {
        this.actionDispatcher.dispatch(gameCreateActionContract, result.value);
      }
    });
  }

  public render() {
    this.app.topSlot.attach(this.top.$root);
    this.app.contentSlot.attach(this.$root);
    this.app.render();
  }

  // protected async whenJoinGameClicked() {
  //   const modal = createJoinModal();
  //   this.modalManager.mount(modal);
  //   const result = await modal.promise;
  //   if (result.type === "cancel") {
  //     return;
  //   }
  //   this.joinGameChannel.emit(result.value);
  // }
}

export function provideHomepageView(resolver: DependencyResolver) {
  return new HomeView(
    resolver.resolve(actionDispatcherDependency),
    resolver.resolve(appViewDependency),
    resolver.resolve(modalManagerDependency),
    resolver.resolve(introTopDependency),
  );
}
export const homepageViewDependency = defineDependency({
  kind: "home-view",
  provider: provideHomepageView,
  scope: frontendScopeContract,
});
