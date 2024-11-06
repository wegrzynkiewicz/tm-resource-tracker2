import { introAppViewDependency } from "../app/intro-app-view.ts";
import { button, div_nodes } from "@acme/dom/nodes.ts";
import { modalManagerDependency } from "../modal.ts";
import { frontendScopeToken } from "../defs.ts";
import { docTitleDependency } from "../app/doc-title.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { Context } from "@acme/dependency/context.ts";
import { Slot } from "@acme/dom/slot.ts";
import { clientGameContextManagerDependency } from "../game/client-game-context.ts";
import { controllerRunnerDependency } from "../controller.ts";
import { createJoinModal } from "./join-game-modal.ts";
import { createPlayerModal } from "../player/player-modal.ts";
import { waitingPath } from "../routes.ts";

export function provideHomepageView(context: Context) {
  const app = context.resolve(introAppViewDependency);
  const docTitle = context.resolve(docTitleDependency);
  const modalManager = context.resolve(modalManagerDependency);
  const clientGameManager = context.resolve(clientGameContextManagerDependency);
  const controllerRunner = context.resolve(controllerRunnerDependency);

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
    const modal = createPlayerModal();
    void modalManager.mount(modal);
    const [status, data] = await modal.ready;
    if (status === true) {
      await clientGameManager.createGame(data);
      await controllerRunner.run(waitingPath);
    }
  });

  $join.addEventListener("click", async () => {
    const modal = createJoinModal();
    void modalManager.mount(modal);
    const [status, data] = await modal.ready;
    if (status === true) {
      await clientGameManager.joinClientGame(data);
      await controllerRunner.run(waitingPath);
    }
  });

  const attachResumeGame = () => {
    const $resume = button(`box _action`, "Resume the Game");
    resumeSlot.attach($resume);
  };

  const render = () => {
    docTitle.setTitle("Home");
    app.contentSlot.attach($root);
    app.render();
  };

  return { $root, attachResumeGame, render };
}

export const homepageViewDependency = defineDependency({
  provider: provideHomepageView,
  scopeToken: frontendScopeToken,
});
