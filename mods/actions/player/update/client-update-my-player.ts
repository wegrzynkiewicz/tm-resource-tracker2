import { ServiceResolver } from "../../../common/dependency.ts";
import { GADefinition, GAHandler } from "../../../common/communication/define.ts";
import { Player, PlayerUpdateDTO, providePlayer } from "../common.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../broadcast.ts";
import { GADispatcher, provideGADispatcher } from "../../../common/communication/dispatcher.ts";
import { serverUpdatedMyPlayerGADef } from "./server-updated-my-player.ts";

export type ClientUpdatingMyPlayerGA = PlayerUpdateDTO;

export const clientUpdatingMyPlayerGADef: GADefinition<ClientUpdatingMyPlayerGA> = {
  kind: 'client-updating-my-player',
};

export class ClientUpdatingMyPlayerGAHandler implements GAHandler<ClientUpdatingMyPlayerGA>{
  public constructor(
    private readonly player: Player,
    private readonly playerBroadcast: PlayerBroadcast,
    private readonly dispatcher: GADispatcher,
  ) { }

  public async handle(action: ClientUpdatingMyPlayerGA): Promise<void> {
    const { color, name } = action;
    this.player.color = color
    this.player.name = name;
    this.playerBroadcast.sendPlayersData();
    this.dispatcher.send(serverUpdatedMyPlayerGADef, action);
  }
}

export function provideClientUpdatingMyPlayerGAHandler(resolver: ServiceResolver) {
  return new ClientUpdatingMyPlayerGAHandler(
    resolver.resolve(providePlayer),
    resolver.resolve(providePlayerBroadcast),
    resolver.resolve(provideGADispatcher),
  );
}
