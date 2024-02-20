import { waitingPlayersGADef } from "../../action/waiting-players-ga.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { GADefinition } from "../../communication/define.ts";
import { provideGADispatcher } from "../../communication/dispatcher.ts";
import { ServerPlayerContextManager } from "./context.ts";
import { provideServerPlayerContextManager } from "./context.ts";
import { ServerPlayerDataManager, provideServerPlayerDataManager } from "./data.ts";

export class PlayerBroadcast {
  public constructor(
    private readonly dataManager: ServerPlayerDataManager,
    private readonly contextManager: ServerPlayerContextManager,
  ) { }

  public sendWaitingPlayers() {
    const players = [...this.dataManager.fetchPlayers()];
    this.send(waitingPlayersGADef, { players });
  }

  public send<TData>(definition: GADefinition<TData>, body: TData): void {
    for (const playerContext of this.contextManager.players.values()) {
      const dispatcher = playerContext.resolver.resolve(provideGADispatcher)
      dispatcher.send(definition, body);
    }
  }
}

export function providePlayerBroadcast(resolver: ServiceResolver) {
  return new PlayerBroadcast(
    resolver.resolve(provideServerPlayerDataManager),
    resolver.resolve(provideServerPlayerContextManager),
  );
}
