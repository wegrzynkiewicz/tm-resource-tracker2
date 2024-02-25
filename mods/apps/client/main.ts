import { createGlobalContext } from "../../common/global.ts";
import { provideClientGameManager } from "../../actions/game/client/manager.ts";
import { provideLoadingView } from "../../actions/page/loading/loading-view.ts";

async function start() {
  const { resolver } = createGlobalContext();
  const loading = resolver.resolve(provideLoadingView);
  loading.render();

  const game = resolver.resolve(provideClientGameManager);
  await game.bootstrap();
}
start();
