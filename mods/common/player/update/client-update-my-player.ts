import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { GAHandler } from "../../../core/communication/define.ts";
import { Player, providePlayer } from "../player.layout.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../player-broadcast.ts";
import { waitingPlayersGADef } from "../waiting/common.ts";
import { ClientUpdatingMyPlayerGA } from "./common.ts";

export class ClientUpdatingMyPlayerGAHandler implements GAHandler<ClientUpdatingMyPlayerGA> {
  public constructor(
    private readonly player: Player,
    private readonly playerBroadcast: PlayerBroadcast,
  ) {}

  public async handle(action: ClientUpdatingMyPlayerGA): Promise<void> {
    const { color, name } = action;
    this.player.color = color;
    this.player.name = name;
    const players = [...this.playerBroadcast.fetchOnlinePlayers()];
    this.playerBroadcast.send(waitingPlayersGADef, { players });
  }
}

export function provideClientUpdatingMyPlayerGAHandler(resolver: DependencyResolver) {
  return new ClientUpdatingMyPlayerGAHandler(
    resolver.resolve(playerDependency),
    resolver.resolve(playerBroadcastDependency),
  );
}
