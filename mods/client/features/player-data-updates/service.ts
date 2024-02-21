import { playerDataUpdateGADef } from "../../../action/player-data-update.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GADispatcher, provideGADispatcher } from "../../../communication/dispatcher.ts";
import { PlayerDataUpdateDTO } from "../../../player/data.ts";

export class PlayerDataUpdater {
  public constructor(
    private readonly dispatcher: GADispatcher,
  ) { }

  public updatePlayerData(data: PlayerDataUpdateDTO) {
    this.dispatcher.send(playerDataUpdateGADef, data);
  }
}

export function providePlayerDataUpdater(resolver: ServiceResolver) {
  return new PlayerDataUpdater(
    resolver.resolve(provideGADispatcher),
  );
}
