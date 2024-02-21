import { waitingPlayersGADef } from "../../action/waiting-players-ga.ts";
import { Handler } from "../../common/channel.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { GADefinition } from "../../communication/define.ts";
import { provideGADispatcher } from "../../communication/dispatcher.ts";
import { WaitingPlayer } from "../../domain/waiting-players.ts";
import { providePlayerData } from "../../player/data.ts";
import { ServerPlayerContext, ServerPlayerContextManager } from "./context.ts";
import { provideServerPlayerContextManager } from "./context.ts";

export class PlayerBroadcast implements Handler<ServerPlayerContext> {
  public constructor(
    private readonly manager: ServerPlayerContextManager,
  ) { }

  public handle() {
    this.sendWaitingPlayers();
  }

  public sendWaitingPlayers() {
    const players = [...this.fetchOnlinePlayers()];
    this.send(waitingPlayersGADef, { players });
  }

  public *fetchOnlinePlayers(): Generator<WaitingPlayer, void, unknown> {
    for (const { resolver } of this.manager.players.values()) {
      const player = resolver.resolve(providePlayerData);
      const { color, isAdmin, name, playerId } = player;
      const waitingPlayer: WaitingPlayer = {
        colorKey: color.key,
        isAdmin,
        name,
        playerId,
      };
      yield waitingPlayer;
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
