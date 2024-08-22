import { provideGADispatcher } from "../../core/communication/dispatcher.ts";
import { ServiceResolver } from "../../core/dependency.ts";
import { ServerGameContext, provideServerGameContext } from "../game/server/context.ts";
import { GameStage } from "../game/stage/common.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../player/player-broadcast.ts";
import { ServerPlayerManager, provideServerPlayerManager } from "../player/server/manager.ts";
import { PlayingGame, playingGameGADef, providePlayingGame } from "./common.ts";

export class PlayingGameStage implements GameStage {
  public readonly kind = "playing";
  private readonly playingGame: PlayingGame;
  public constructor(
    private readonly playerBroadcast: PlayerBroadcast,
    private readonly serverGameContext: ServerGameContext,
    private readonly serverPlayerManager: ServerPlayerManager,
  ) {
    const { resolver } = this.serverGameContext;
    const players = [...this.serverPlayerManager.players.values()];
    this.playingGame = {
      initPoints: 20,
      players,
    };
    resolver.inject(providePlayingGame, this.playingGame);
  }

  public handlePlayerContextCreation(ctx: ServerGameContext) {
    const { resolver } = ctx;
    const dispatcher = resolver.resolve(provideGADispatcher);
    dispatcher.send(playingGameGADef, this.playingGame);
  }

  public handlePlayerContextDeletion() {
    // nothing;
  }

  public run() {
    this.playerBroadcast.send(playingGameGADef, this.playingGame);
  }

  public broadcastPlayers() {
    this.playerBroadcast.send(playingGameGADef, this.playingGame);
  }
}

export function providePlayingGameStage(resolver: ServiceResolver) {
  return new PlayingGameStage(
    resolver.resolve(providePlayerBroadcast),
    resolver.resolve(provideServerGameContext),
    resolver.resolve(provideServerPlayerManager),
  );
}
