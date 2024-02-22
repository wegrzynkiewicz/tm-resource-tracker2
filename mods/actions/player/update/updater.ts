import { playerDataUpdateGADef } from "../server/player-data-update.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GADispatcher, provideGADispatcher } from "../../../common/communication/dispatcher.ts";
import { PlayerUpdateDTO } from "../common.ts";

export class PlayerUpdater {
  public constructor(
    private readonly dispatcher: GADispatcher,
  ) { }

  public updatePlayer(data: PlayerUpdateDTO) {
    this.dispatcher.send(playerDataUpdateGADef, data);
  }
}

export function providePlayerUpdater(resolver: ServiceResolver) {
  return new PlayerUpdater(
    resolver.resolve(provideGADispatcher),
  );
}
