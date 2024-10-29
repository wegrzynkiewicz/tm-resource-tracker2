import { provideGADispatcher } from "../../core/communication/dispatcher.ts";
import { Context } from "@acme/dependency/service-resolver.ts";
import { provideServerGameContext, ServerGameContext } from "../game/server/context.ts";
import { GameStage } from "../game/stage/common.ts";
import { PlayerBroadcast, providePlayerBroadcast } from "../player/player-broadcast.ts";
import { provideServerPlayerManager, ServerPlayerManager } from "../player/server/manager.ts";
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
    resolver.inject(playingGameDependency, this.playingGame);
  }

  public handlePlayerContextCreation(ctx: ServerGameContext) {
    const { resolver } = ctx;
    const dispatcher = context.resolve(gADispatcherDependency);
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

export function providePlayingGameStage(context: Context) {
  return new PlayingGameStage(
    context.resolve(playerBroadcastDependency),
    context.resolve(serverGameContextDependency),
    context.resolve(serverPlayerManagerDependency),
  );
}
