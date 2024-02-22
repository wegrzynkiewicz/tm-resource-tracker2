import { provideWaitingPlayersCollection } from "./view.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GADefinition, GAHandler } from "../../../common/communication/define.ts";
import { Player } from "../common.ts";
import { Collection } from "../../../common/frontend-framework/store.ts";

export interface WaitingPlayersGA {
  players: Player[];
}

export const waitingPlayersGADef: GADefinition<WaitingPlayersGA> = {
  kind: 'waiting-players',
};

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
