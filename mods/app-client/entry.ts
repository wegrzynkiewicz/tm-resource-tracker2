import { createGlobalContext } from "../core/global.ts";
import { provideClientGameManager } from "../common/game/client/manager.ts";
import { provideLoadingView } from "../common/page/loading/loading-view.ts";

async function start() {
  const { resolver } = createGlobalContext();
  const loading = resolver.resolve(provideLoadingView);
  loading.render();

  const game = resolver.resolve(provideClientGameManager);
  await game.bootstrap();
}
start();
