import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { GADispatcher, provideGADispatcher } from "../../../core/communication/dispatcher.ts";
import { PlayerUpdateDTO } from "../common.ts";
import { clientUpdatingMyPlayerGADef } from "./common.ts";

export class PlayerUpdater {
  public constructor(
    private readonly dispatcher: GADispatcher,
  ) {}

  public updatePlayer(data: PlayerUpdateDTO) {
    this.dispatcher.send(clientUpdatingMyPlayerGADef, data);
  }
}

export function providePlayerUpdater(resolver: DependencyResolver) {
  return new PlayerUpdater(
    resolver.resolve(gADispatcherDependency),
  );
}
