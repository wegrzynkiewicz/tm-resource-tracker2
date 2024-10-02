import { errorNormalCAContract, errorNormalCAHandlerDependency } from "@acme/control-action/error-normal-ca-handler.ts";
import { NaiveNormalCARouter } from "@acme/control-action/normal/naive-router.ts";
import { playersSyncS2CNotNormalCA } from "../../../common/player/defs.ts";
import { playersSyncS2CNotNormalCAHandlerDependency } from "./players-sync-s2c-not-ca-handler.ts";

export function initClientNormalCARouter() {
  return new NaiveNormalCARouter({
    [errorNormalCAContract.name]: errorNormalCAHandlerDependency,
    [playersSyncS2CNotNormalCA.name]: playersSyncS2CNotNormalCAHandlerDependency,
  });
}
