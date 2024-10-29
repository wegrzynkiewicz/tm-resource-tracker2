import { Context } from "../../../qcmf5/mods/dependency/context.ts";
import { playerBroadcastDependency } from "../../player/player-broadcast.ts";
import { serverPlayerContextManagerDependency } from "../../player/player-context.ts";
import { GameStage } from "./defs.ts";
import { playerConnectedChannelDependency } from "../../player/defs.ts";
import { playerDisconnectedChannelDependency } from "../../player/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { serverGameScopeContract } from "../../defs.ts";
import { gameStageS2CNotNormalCAContract, gameSyncS2CNotNormalCAContract } from "@common/game/defs.ts";
import { GameSyncS2CNotDTO } from "@common/game/game-sync-s2c-not-dto.layout.compiled.ts";

export function providePlayingGameStage(context: Context): GameStage {
  const playerConnected = context.resolve(playerConnectedChannelDependency);
  const playerDisconnected = context.resolve(playerDisconnectedChannelDependency);
  const playerBroadcast = context.resolve(playerBroadcastDependency);
  const serverPlayerContextManager = context.resolve(serverPlayerContextManagerDependency);

  const name = "PLAYING" as const;

  const broadcast = () => {
    const data: GameSyncS2CNotDTO = {
      players: serverPlayerContextManager.getPlayersDTO(),
    };
    playerBroadcast.dispatch(gameSyncS2CNotNormalCAContract, data);
  };

  const acquire = () => {
    playerConnected.on(broadcast);
    playerDisconnected.on(broadcast);
    playerBroadcast.dispatch(gameStageS2CNotNormalCAContract, name);
    broadcast();
  };

  const dispose = () => {
    playerConnected.off(broadcast);
    playerDisconnected.off(broadcast);
  };

  return { name, acquire, dispose };
}

export const playingGameStageDependency = defineDependency({
  provider: providePlayingGameStage,
  scope: serverGameScopeContract,
});
