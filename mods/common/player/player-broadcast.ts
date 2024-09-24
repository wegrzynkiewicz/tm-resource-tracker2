import { GADefinition } from "../../core/communication/define.ts";
import { provideGADispatcher } from "../../core/communication/dispatcher.ts";
import { ServerPlayerContextManager } from "./server/context.ts";
import { provideServerPlayerContextManager } from "./server/context.ts";
import { Player, providePlayer } from "./player.layout.ts";
import { DependencyResolver } from "@acme/dependency/service-resolver.ts";

export class PlayerBroadcast {
  public constructor(
    private readonly manager: ServerPlayerContextManager,
  ) {}

  public send<TData>(definition: GADefinition<TData>, body: TData): void {
    for (const { resolver } of this.manager.players.values()) {
      const dispatcher = resolver.resolve(gADispatcherDependency);
      dispatcher.send(definition, body);
    }
  }
  public *fetchOnlinePlayers(): Generator<Player, void, unknown> {
    for (const { resolver } of this.manager.players.values()) {
      const player = resolver.resolve(playerDependency);
      yield player;
    }
  }
}

export function providePlayerBroadcast(resolver: DependencyResolver) {
  return new PlayerBroadcast(
    resolver.resolve(serverPlayerContextManagerDependency),
  );
}
