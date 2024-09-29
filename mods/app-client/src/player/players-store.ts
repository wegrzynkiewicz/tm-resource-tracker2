import { PlayerDTO } from "../../../common/player/player.layout.compiled.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../defs.ts";

export class PlayersStore {
  public readonly updates = new Channel<[]>();

  public constructor(
    public players: PlayerDTO[],
  ) {}

  public setPlayers(players: PlayerDTO[]) {
    this.players = players;
    this.updates.emit();
  }
}

export function providePlayersStore() {
  return new PlayersStore([]);
}

export const playersStoreDependency = defineDependency({
  name: "players-store",
  provider: providePlayersStore,
  scope: frontendScopeContract,
});
