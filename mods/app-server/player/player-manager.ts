import { defineDependency } from "@acme/dependency/declaration.ts";
import { serverGameScopeContract } from "../game/game-context.ts";
import { PlayerDTO } from "../../common/player/player.layout.compiled.ts";
import { PlayerInput } from "../../common/player/player.layout.ts";

export let playerIdCounter = 0;

export class ServerPlayerManager {
  public readonly players = new Map<string, PlayerDTO>();

  public createPlayer(input: PlayerInput): PlayerDTO {
    const { color, isAdmin, name } = input;
    const playerId = (++playerIdCounter).toString();

    const player: PlayerDTO = {
      color,
      isAdmin,
      name,
      playerId,
    };

    this.players.set(playerId, player);
    return player;
  }

  public deletePlayer(playerId: string) {
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
  scope: serverGameScopeContract,
});
