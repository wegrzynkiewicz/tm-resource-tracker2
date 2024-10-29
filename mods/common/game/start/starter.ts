import { provideModalManager } from "../../../app-client/src/modal.ts";
import { provideGADispatcher } from "../../../core/communication/dispatcher.ts";
import { Context } from "@acme/dependency/service-resolver.ts";
import { provideLoadingView } from "../../../app-client/src/loading-view.ts";
import { startGameGADef } from "./common.ts";
import { createStartGameModal } from "./modal.ts";

export interface GameStarter {
  modal(): Promise<void>;
}

export function provideGameStarter(context: Context) {
  const dispatcher = context.resolve(gADispatcherDependency);
  const modalManager = context.resolve(modalManagerDependency);
  const loading = context.resolve(loadingViewDependency);
  const modal = async () => {
    const modal = createStartGameModal();
    modalManager.mount(modal);
    await modal.promise;
    dispatcher.send(startGameGADef, null);
    loading.render();
  };
  return { modal };
}
