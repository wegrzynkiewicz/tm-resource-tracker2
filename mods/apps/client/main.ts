import { createGlobalContext } from "../../common/global.ts";
import { provideClientGameManager } from "../../actions/game/client/manager.ts";
import { historyEntryCreatedChannel } from "./features/history.ts";
import { examples } from "../../common/history.ts";
import { provideLoadingView } from "../../actions/page/loading/loading-view.ts";

async function start() {
  const { resolver } = createGlobalContext();
  const loading = resolver.resolve(provideLoadingView);
  loading.render();

  historyEntryCreatedChannel.emit(examples[0]);
  historyEntryCreatedChannel.emit(examples[1]);
  historyEntryCreatedChannel.emit(examples[2]);
  historyEntryCreatedChannel.emit(examples[3]);

  const game = resolver.resolve(provideClientGameManager);
  await game.bootstrap();
}
start();
