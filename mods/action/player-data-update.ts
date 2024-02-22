import { ServiceResolver } from "../common/dependency.ts";
import { GADefinition, GAHandler } from "../communication/define.ts";
import { Player, PlayerUpdateDTO, providePlayer } from "../domain/player.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../server/player/broadcast.ts";

export type PlayerDataUpdateGA = PlayerUpdateDTO;

export const playerDataUpdateGADef: GADefinition<PlayerDataUpdateGA> = {
  kind: 'player-data-update',
};

export class PlayerDataUpdateGAHandler implements GAHandler<PlayerDataUpdateGA>{
  public constructor(
    private readonly player: Player,
    private readonly playerBroadcast: PlayerBroadcast
  ) { }

  public async handle(action: PlayerDataUpdateGA): Promise<void> {
    const { color, name } = action;
    this.player.color = color
    this.player.name = name;
    this.playerBroadcast.sendPlayersData();
  }
}

export function providePlayerDataUpdateGAHandler(resolver: ServiceResolver) {
  return new PlayerDataUpdateGAHandler(
    resolver.resolve(providePlayer),
    resolver.resolve(providePlayerBroadcast),
  );
}
