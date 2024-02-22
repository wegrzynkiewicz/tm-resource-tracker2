import { provideWaitingPlayersCollection } from "./view.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GAHandler } from "../../../common/communication/define.ts";
import { Player } from "../common.ts";
import { Collection } from "../../../common/frontend-framework/store.ts";
import { WaitingPlayersGA } from "./common.ts";

export class WaitingPlayersGAHandler implements GAHandler<WaitingPlayersGA>{
  public constructor(
    private readonly players: Collection<Player>,
  ) { }

  public async handle(action: WaitingPlayersGA): Promise<void> {
    this.players.items.splice(0, this.players.items.length, ...action.players);
    this.players.update();
  }
}

export function provideWaitingPlayersGAHandler(resolver: ServiceResolver) {
  return new WaitingPlayersGAHandler(
    resolver.resolve(provideWaitingPlayersCollection),
  );
}
