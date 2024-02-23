import { ServiceResolver } from "../../common/dependency.ts";
import { GADefinition } from "../../common/communication/define.ts";
import { provideGADispatcher } from "../../common/communication/dispatcher.ts";
import { ServerPlayerContextManager } from "./server/context.ts";
import { provideServerPlayerContextManager } from "./server/context.ts";
import { Player, providePlayer } from "./common.ts";

export class PlayerBroadcast {
  public constructor(
    private readonly manager: ServerPlayerContextManager,
  ) { }

  public send<TData>(definition: GADefinition<TData>, body: TData): void {
    for (const { resolver } of this.manager.players.values()) {
      const dispatcher = resolver.resolve(provideGADispatcher)
      dispatcher.send(definition, body);
    }
  }
  public *fetchOnlinePlayers(): Generator<Player, void, unknown> {
    for (const { resolver } of this.manager.players.values()) {
      const player = resolver.resolve(providePlayer);
      yield player;
    }
  }
}

export function providePlayerBroadcast(resolver: ServiceResolver) {
  return new PlayerBroadcast(
    resolver.resolve(provideServerPlayerContextManager),
  );
}
