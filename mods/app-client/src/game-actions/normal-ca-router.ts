import { errorNormalCAContract, errorNormalCAHandlerDependency } from "@acme/control-action/error-normal-ca-handler.ts";
import { NaiveNormalCARouter } from "@acme/control-action/normal/naive-router.ts";
import { playersSyncNotS2CNormalCA } from "../../../common/player/actions.ts";
import { playersSyncS2CNotNormalCAHandlerDependency } from "./players-sync-s2c-not-ca-handler.ts";

export function initClientNormalCARouter() {
  return new NaiveNormalCARouter({
    [errorNormalCAContract.name]: errorNormalCAHandlerDependency,
    [playersSyncNotS2CNormalCA.name]: playersSyncS2CNotNormalCAHandlerDependency,
  });
}
