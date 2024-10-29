import { createPanel } from "../../app-client/src/frontend/app/panel.ts";
import { ModalManager, provideModalManager } from "../../app-client/src/modal.ts";
import { SelectorStore } from "../../app-client/src/frontend/utils/selector.ts";
import { Context } from "@acme/dependency/service-resolver.ts";
import { PlayingGame, providePlayingGame } from "../playing/common.ts";
import { PlayingAppView, providePlayingAppView } from "../playing/playing-app-view.ts";
import { PlayingTop, providePlayingPlayerStore, providePlayingTop } from "../playing/playing-top.ts";
import { ProjectsItem } from "./projects-item.ts";

export class ProjectsView {
  public readonly items: ProjectsItem[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly app: PlayingAppView,
    private readonly playingGame: PlayingGame,
    private readonly top: PlayingTop,
    private readonly playerIndex: SelectorStore,
  ) {
    this.items = playingGame.players.map(() => new ProjectsItem());
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(playerIndex, roots);
  }

  public render() {
    this.top.setLabel("Projects");
    this.app.render(
      this.top.$root,
      this.$root,
    );
  }
}

export function provideProjectsView(context: Context) {
  return new ProjectsView(
    context.resolve(modalManagerDependency),
    context.resolve(playingAppViewDependency),
    context.resolve(playingGameDependency),
    context.resolve(playingTopDependency),
    context.resolve(playingPlayerStoreDependency),
  );
}
