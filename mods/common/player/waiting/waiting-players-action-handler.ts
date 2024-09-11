import { provideWaitingPlayersCollection } from "./waiting-view.ts";
import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { GAHandler } from "../../../core/communication/define.ts";
import { Player } from "../common.ts";

import { WaitingPlayersGA } from "./common.ts";

export class WaitingPlayersGAHandler implements GAHandler<WaitingPlayersGA> {
  public constructor(
    private readonly players: Collection<Player>,
  ) {}

  public async handle(action: WaitingPlayersGA): Promise<void> {
    this.players.items.splice(0, this.players.items.length, ...action.players);
    this.players.update();
  }
}

export function provideWaitingPlayersGAHandler(resolver: DependencyResolver) {
  return new WaitingPlayersGAHandler(
    resolver.resolve(waitingPlayersCollectionDependency),
  );
}
