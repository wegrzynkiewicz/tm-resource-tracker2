import { provideModalManager } from "../../../app-client/src/modal.ts";
import { provideGADispatcher } from "../../../core/communication/dispatcher.ts";
import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { provideLoadingView } from "../../../app-client/src/loading-view.ts";
import { startGameGADef } from "./common.ts";
import { createStartGameModal } from "./modal.ts";

export interface GameStarter {
  modal(): Promise<void>;
}

export function provideGameStarter(resolver: DependencyResolver) {
  const dispatcher = resolver.resolve(gADispatcherDependency);
  const modalManager = resolver.resolve(modalManagerDependency);
  const loading = resolver.resolve(loadingViewDependency);
  const modal = async () => {
    const modal = createStartGameModal();
    modalManager.mount(modal);
    await modal.promise;
    dispatcher.send(startGameGADef, null);
    loading.render();
  };
  return { modal };
}
