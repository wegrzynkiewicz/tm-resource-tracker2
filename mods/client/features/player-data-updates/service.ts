import { playerDataUpdateGADef } from "../../../action/player-data-update.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GADispatcher, provideGADispatcher } from "../../../communication/dispatcher.ts";
import { PlayerUpdateDTO } from "../../../domain/player.ts";

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
