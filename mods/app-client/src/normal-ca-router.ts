import {
  errorNormalCAContract,
  errorNormalCAHandlerDependency,
} from "@framework/control-action/error-normal-ca-handler.ts";
import { NaiveNormalCARouter } from "@framework/control-action/normal/naive-router.ts";
import { playersSyncS2CNotNormalCAHandlerDependency } from "./player/players-sync-s2c-not-ca-handler.ts";
import { playersSyncS2CNotNormalCAContract } from "@common/player/defs.ts";
import { gameStageS2CNotNormalCAContract, gameSyncS2CNotNormalCAContract } from "@common/game/defs.ts";
import { gameSyncS2CNotNormalCAHandlerDependency } from "./game/game-sync-s2c-not-ca-handler.ts";
import { gameStageS2CNotNormalCAHandlerDependency } from "./game/game-stage-s2c-not-ca-handler.ts";

export function initClientNormalCARouter() {
  return new NaiveNormalCARouter({
    [errorNormalCAContract.name]: errorNormalCAHandlerDependency,
    [playersSyncS2CNotNormalCAContract.name]: playersSyncS2CNotNormalCAHandlerDependency,
    [gameStageS2CNotNormalCAContract.name]: gameStageS2CNotNormalCAHandlerDependency,
    [gameSyncS2CNotNormalCAContract.name]: gameSyncS2CNotNormalCAHandlerDependency,
  });
}
