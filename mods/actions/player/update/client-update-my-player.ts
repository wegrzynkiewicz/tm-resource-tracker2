import { ServiceResolver } from "../../../common/dependency.ts";
import { GADefinition, GAHandler } from "../../../common/communication/define.ts";
import { Player, PlayerUpdateDTO, providePlayer } from "../common.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../player-broadcast.ts";
import { waitingPlayersGADef } from "../waiting/common.ts";

export type ClientUpdatingMyPlayerGA = PlayerUpdateDTO;

export const clientUpdatingMyPlayerGADef: GADefinition<ClientUpdatingMyPlayerGA> = {
  kind: 'client-updating-my-player',
};

export class ClientUpdatingMyPlayerGAHandler implements GAHandler<ClientUpdatingMyPlayerGA>{
  public constructor(
    private readonly player: Player,
    private readonly playerBroadcast: PlayerBroadcast,
  ) { }

  public async handle(action: ClientUpdatingMyPlayerGA): Promise<void> {
    const { color, name } = action;
    this.player.color = color
    this.player.name = name;
    const players = [...this.playerBroadcast.fetchOnlinePlayers()];
    this.playerBroadcast.send(waitingPlayersGADef, { players });
  }
}

export function provideClientUpdatingMyPlayerGAHandler(resolver: ServiceResolver) {
  return new ClientUpdatingMyPlayerGAHandler(
    resolver.resolve(providePlayer),
    resolver.resolve(providePlayerBroadcast),
  );
}
