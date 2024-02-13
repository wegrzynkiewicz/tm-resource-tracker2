import { Context } from "../../common/context.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideServerGameContext, ServerGameContext } from "../game/game.ts";
import { providePlayerData } from "./data.ts";
import { PlayerDataManager, PlayerInput } from "./data.ts";
import { providePlayerDataManager } from "./data.ts";

export interface ServerPlayerContextIdentifier {
  gameId: string;
  playerId: number;
}

export type ServerPlayerContext = Context<ServerPlayerContextIdentifier>;

export function provideServerPlayerContext(): ServerPlayerContext {
  throw new Error('server-player-context-must-be-injected');
}

export class ServerPlayerContextManager {
  public readonly players = new Map<number, ServerPlayerContext>();

  public constructor(
    public readonly playerDataManager: PlayerDataManager,
    public readonly serverGameContext: ServerGameContext,
  ) { }

  public createServerPlayerContext(input: PlayerInput): ServerPlayerContext {
    const player = this.playerDataManager.createPlayerData(input);
    const { playerId } = player;
    const gameId = this.serverGameContext.identifier.gameId;
    const resolver = new ServiceResolver(this.serverGameContext.resolver);
    const serverPlayerContext: ServerPlayerContext = {
      descriptor: `/game/${gameId}/player/${playerId}`,
      identifier: { gameId, playerId },
      resolver,
    };

    resolver.inject(provideServerPlayerContext, serverPlayerContext);
    resolver.inject(providePlayerData, player);

    this.players.set(playerId, serverPlayerContext);
    return serverPlayerContext;
  }
}

export function provideServerPlayerContextManager(resolver: ServiceResolver) {
  return new ServerPlayerContextManager(
    resolver.resolve(providePlayerDataManager),
    resolver.resolve(provideServerGameContext),
  );
}
