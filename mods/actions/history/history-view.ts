import { createPanel } from "../../apps/client/features/app/panel.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { PlayingAppView } from "../playing/playing-app-view.ts";
import { providePlayingAppView } from "../playing/playing-app-view.ts";
import { HistoryItemView } from "./history-item.ts";

export class HistoryView {
  public readonly items: HistoryItemView[];
  public readonly $root: HTMLDivElement;

  public constructor(
    private readonly app: PlayingAppView,
  ) {
    this.items = [1, 2, 3].map(() => new HistoryItemView());
    const roots = this.items.map(({ $root }) => $root);
    this.$root = createPanel(roots);
  }

  public render() {
    this.app.render(this.$root);
  }
}

export function provideHistoryView(resolver: ServiceResolver) {
  return new HistoryView(
    resolver.resolve(providePlayingAppView),
  );
}
