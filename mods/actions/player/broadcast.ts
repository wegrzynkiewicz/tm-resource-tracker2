import { ServiceResolver } from "../../common/dependency.ts";
import { GADefinition } from "../../common/communication/define.ts";
import { provideGADispatcher } from "../../common/communication/dispatcher.ts";
import { Player, providePlayer } from "./common.ts";
import { ServerPlayerContextManager } from "./server/context.ts";
import { provideServerPlayerContextManager } from "./server/context.ts";
import { waitingPlayersGADef } from "./waiting/common.ts";

export class PlayerBroadcast {
  public constructor(
    private readonly manager: ServerPlayerContextManager,
  ) { }

  public sendPlayersData() {
    const players = [...this.fetchOnlinePlayers()];
    this.send(waitingPlayersGADef, { players });
  }

  public *fetchOnlinePlayers(): Generator<Player, void, unknown> {
    for (const { resolver } of this.manager.players.values()) {
      const player = resolver.resolve(providePlayer);
      yield player;
    }
  }

  public send<TData>(definition: GADefinition<TData>, body: TData): void {
    for (const playerContext of this.manager.players.values()) {
      const dispatcher = playerContext.resolver.resolve(provideGADispatcher)
      dispatcher.send(definition, body);
    }
  }
}

export function providePlayerBroadcast(resolver: ServiceResolver) {
  return new PlayerBroadcast(
    resolver.resolve(provideServerPlayerContextManager),
  );
}
