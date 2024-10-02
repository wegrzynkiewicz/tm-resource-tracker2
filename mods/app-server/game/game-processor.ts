import { PlayerBroadcast, playerBroadcastDependency } from "../player/player-broadcast.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { serverGameScopeContract } from "../defs.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { gameSyncS2CNotNormalCAContract } from "@common/game/defs.ts";
import { GameSyncS2CNotDTO } from "@common/game/game-sync-s2c-not-dto.layout.compiled.ts";
import { GameStage, gameStageDependency } from "./game-stage.ts";
import { PlayerSync, playerSyncDependency } from "../player/player-sync.ts";

export class GameProcessor {
  public constructor(
    private readonly gameStage: GameStage,
    private readonly playerBroadcast: PlayerBroadcast,
    private readonly playerSync: PlayerSync,
  ) {}

  public broadcast() {
    const data: GameSyncS2CNotDTO = {
      stage: this.gameStage.stage,
      players: this.playerSync.getPlayersDTO(),
    };
    this.playerBroadcast.dispatch(gameSyncS2CNotNormalCAContract, data);
  }
}

export function provideGameProcessor(resolver: DependencyResolver) {
  return new GameProcessor(
    resolver.resolve(gameStageDependency),
    resolver.resolve(playerBroadcastDependency),
    resolver.resolve(playerSyncDependency),
  );
}

export const gameProcessorDependency = defineDependency({
  name: "game-processor",
  provider: provideGameProcessor,
  scope: serverGameScopeContract,
});
