import { obtainColor } from "../common/colors.ts";
import { ServiceResolver } from "../common/dependency.ts";
import { GADefinition, GAHandler } from "../communication/define.ts";
import { Player, PlayerDataUpdateDTO, providePlayerData } from "../player/data.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../server/player/broadcast.ts";

export type PlayerDataUpdateGA = PlayerDataUpdateDTO;

export const playerDataUpdateGADef: GADefinition<PlayerDataUpdateGA> = {
  kind: 'player-data-update',
};

export class PlayerDataUpdateGAHandler implements GAHandler<PlayerDataUpdateGA>{
  public constructor(
    private readonly player: Player,
    private readonly playerBroadcast: PlayerBroadcast
  ) { }

  public async handle(action: PlayerDataUpdateGA): Promise<void> {
    this.player.color = obtainColor(action.colorKey);
    this.player.name = action.name;
    this.playerBroadcast.sendPlayersData();
  }
}

export function providePlayerDataUpdateGAHandler(resolver: ServiceResolver) {
  return new PlayerDataUpdateGAHandler(
    resolver.resolve(providePlayerData),
    resolver.resolve(providePlayerBroadcast),
  );
}
