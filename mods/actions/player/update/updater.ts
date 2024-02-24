import { ServiceResolver } from "../../../common/dependency.ts";
import { GADispatcher, provideGADispatcher } from "../../../common/communication/dispatcher.ts";
import { PlayerUpdateDTO } from "../common.ts";
import { clientUpdatingMyPlayerGADef } from "./common.ts";

export class PlayerUpdater {
  public constructor(
    private readonly dispatcher: GADispatcher,
  ) { }

  public updatePlayer(data: PlayerUpdateDTO) {
    this.dispatcher.send(clientUpdatingMyPlayerGADef, data);
  }
}

export function providePlayerUpdater(resolver: ServiceResolver) {
  return new PlayerUpdater(
    resolver.resolve(provideGADispatcher),
  );
}
