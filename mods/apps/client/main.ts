import { createGlobalContext } from "../../common/global.ts";
import { provideAppView } from "./features/app/app.ts";
import { provideClientGameManager } from "../../actions/game/client/manager.ts";
import { createHistoriesPanel, historyEntryCreatedChannel } from "./features/history.ts";
import { createProjectsPanel } from "./features/project.ts";
import { createSettings } from "./features/settings.ts";
import { examples } from "../../common/history.ts";
import { provideLoadingViewRenderer } from "../../actions/page/loading/loading-view-renderer.ts";

async function start() {
  const { resolver } = createGlobalContext();
  const app = resolver.resolve(provideAppView);
  {
    app.switcher.nodes.set("projects", createProjectsPanel());
    app.switcher.nodes.set("histories", createHistoriesPanel());
    app.switcher.nodes.set("settings", createSettings());

    const loadingViewRenderer = resolver.resolve(provideLoadingViewRenderer);
    loadingViewRenderer.render();

    document.body.appendChild(app.$root);
  }

  historyEntryCreatedChannel.emit(examples[0]);
  historyEntryCreatedChannel.emit(examples[1]);
  historyEntryCreatedChannel.emit(examples[2]);
  historyEntryCreatedChannel.emit(examples[3]);

  const game = resolver.resolve(provideClientGameManager);
  await game.bootstrap();
}
start();
