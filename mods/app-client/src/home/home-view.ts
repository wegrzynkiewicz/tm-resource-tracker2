import { appViewDependency } from "../app/app-view.ts";
import { button, div_nodes } from "@acme/dom/nodes.ts";
import { PlayerModal } from "../../../common/player/update/player-modal.ts";
import { modalManagerDependency } from "../modal.ts";
import { frontendScopeContract } from "../../bootstrap.ts";
import { docTitleDependency } from "../app/doc-title.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { Slot } from "../place.ts";
import { clientGameManagerDependency } from "../game/game-context.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { waitingPath } from "../waiting/waiting-defs.ts";

export function provideHomepageView(resolver: DependencyResolver) {
  const app = resolver.resolve(appViewDependency);
  const docTitle = resolver.resolve(docTitleDependency);
  const modalManager = resolver.resolve(modalManagerDependency);
  const clientGameManager = resolver.resolve(clientGameManagerDependency);
  const controllerRunner = resolver.resolve(controllerRunnerDependency);

  const resumeSlot = new Slot("resume");

  const $create = button(`box _action`, "New Game");
  const $join = button("box _action", "Join the Game");
  const $about = button("box _action", "About");

  const $root = div_nodes("homepage", [
    resumeSlot.$root,
    $create,
    $join,
    $about,
  ]);

  $create.addEventListener("click", async () => {
    const modal = new PlayerModal();
    modalManager.mount(modal);
    const [status, data] = await modal.ready;
    if (status === true) {
      await clientGameManager.createClientGame(data);
      await controllerRunner.run(waitingPath);
    }
  });

  const attachResumeGame = () => {
    const $resume = button(`box _action`, "Resume the Game");
    resumeSlot.attach($resume);
  }

  const render = () => {
    docTitle.setTitle("Home");
    app.contentSlot.attach($root);
    app.render();
  }

  return { $root, attachResumeGame, render };
}

export const homepageViewDependency = defineDependency({
  name: "home-view",
  provider: provideHomepageView,
  scope: frontendScopeContract,
});
