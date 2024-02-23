import { ModalManager, provideModalManager } from "../../../apps/client/features/modal.ts";
import { GADispatcher, provideGADispatcher } from "../../../common/communication/dispatcher.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { startGameGADef } from "./common.ts";
import { createStartGameModal } from "./modal.ts";

export class GameStarter {
  public constructor(
    private readonly dispatcher: GADispatcher,
    private readonly modalManager: ModalManager,
  ) { }

  public async modal() {
    const modal = createStartGameModal();
    this.modalManager.mount(modal);
    await modal.promise;
    this.start();
  }

  public start() {
    this.dispatcher.send(startGameGADef, null);
  }
}

export function provideGameStarter(resolver: ServiceResolver) {
  return new GameStarter(
    resolver.resolve(provideGADispatcher),
    resolver.resolve(provideModalManager),
  );
}
