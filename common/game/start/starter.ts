import { provideModalManager } from "../../../app-client/src/modal.ts";
import { provideGADispatcher } from "../../../core/communication/dispatcher.ts";
import { ServiceResolver } from "../../../core/dependency.ts";
import { provideLoadingView } from "../../page/loading/loading-view.ts";
import { startGameGADef } from "./common.ts";
import { createStartGameModal } from "./modal.ts";

export interface GameStarter {
  modal(): Promise<void>;
}

export function provideGameStarter(resolver: ServiceResolver) {
  const dispatcher = resolver.resolve(provideGADispatcher);
  const modalManager = resolver.resolve(provideModalManager);
  const loading = resolver.resolve(provideLoadingView);
  const modal = async () => {
    const modal = createStartGameModal();
    modalManager.mount(modal);
    await modal.promise;
    dispatcher.send(startGameGADef, null);
    loading.render();
  }
  return { modal };
}
