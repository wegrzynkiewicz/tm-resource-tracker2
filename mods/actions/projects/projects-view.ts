import { createPanel } from "../../apps/client/features/app/panel.ts";
import { ModalManager, provideModalManager } from "../../apps/client/features/modal.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { PlayingGame, providePlayingGame } from "../playing/common.ts";
import { PlayingAppView, providePlayingAppView } from "../playing/playing-app-view.ts";
import { PlayingTop, providePlayingTop } from "../playing/playing-top.ts";
import { ProjectsItem } from "./projects-item.ts";

export class ProjectsView {
  public readonly items: ProjectsItem[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly modalManager: ModalManager,
    private readonly app: PlayingAppView,
    private readonly playingGame: PlayingGame,
    private readonly top: PlayingTop,
  ) {
    this.items = playingGame.players.map(() => new ProjectsItem());
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(roots);
  }

  public render() {
    this.top.setLabel("Projects");
    this.app.render(
      this.top.$root,
      this.$root,
    );
  }
}

export function provideProjectsView(resolver: ServiceResolver) {
  return new ProjectsView(
    resolver.resolve(provideModalManager),
    resolver.resolve(providePlayingAppView),
    resolver.resolve(providePlayingGame),
    resolver.resolve(providePlayingTop),
  );
}
