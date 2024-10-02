import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { serverGameScopeContract } from "../defs.ts";
import { PlayerBroadcast, playerBroadcastDependency } from "./player-broadcast.ts";
import {
  ServerPlayerContextManager,
  serverPlayerContextManagerDependency,
  serverPlayerDTODependency,
} from "./player-context.ts";
import { playersSyncS2CNotNormalCAContract } from "@common/player/defs.ts";

export class PlayerSync {
  public constructor(
    private readonly playerBroadcast: PlayerBroadcast,
    private readonly serverPlayerContextManager: ServerPlayerContextManager,
  ) {}

  public getPlayersDTO(): PlayerDTO[] {
    const players: PlayerDTO[] = [];
    for (const playerContext of this.serverPlayerContextManager.players.values()) {
      const player = playerContext.resolver.resolve(serverPlayerDTODependency);
      players.push(player);
    }
    return players;
  }

  public broadcast() {
    const players = this.getPlayersDTO();
    this.playerBroadcast.dispatch(playersSyncS2CNotNormalCAContract, { players });
  }
}

export function providePlayerSync(resolver: DependencyResolver) {
  return new PlayerSync(
    resolver.resolve(playerBroadcastDependency),
    resolver.resolve(serverPlayerContextManagerDependency),
  );
}

export const playerSyncDependency = defineDependency({
  name: "player-sync",
  provider: providePlayerSync,
  scope: serverGameScopeContract,
});
