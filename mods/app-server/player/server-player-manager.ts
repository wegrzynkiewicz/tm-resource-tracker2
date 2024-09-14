import { defineDependency } from "@acme/dependency/declaration.ts";
import { Player, PlayerInput } from "../../common/player/common.ts";
import { serverGameScopeContract } from "../game/game-scope.ts";

export let playerIdCounter = 0;

export class ServerPlayerManager {
  public readonly players = new Map<number, Player>();

  public createPlayer(input: PlayerInput): Player {
    const { color, isAdmin, name } = input;
    const playerId = ++playerIdCounter;

    const player: Player = {
      color,
      isAdmin,
      name,
      playerId,
    };

    this.players.set(playerId, player);
    return player;
  }

  public deletePlayer(playerId: number) {
    const playerData = this.players.get(playerId);
    if (playerData === undefined) {
      return;
    }
    this.players.delete(playerId);
  }
}

export function provideServerPlayerManager() {
  return new ServerPlayerManager();
}

export const serverPlayerManagerDependency = defineDependency({
  name: "server-player-manager",
  provider: provideServerPlayerManager,
  scope: serverGameScopeContract
});
