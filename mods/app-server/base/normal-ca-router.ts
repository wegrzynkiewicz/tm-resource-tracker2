import { gameStartC2SNotNormalCAHandlerDependency } from "../game/game-start-ca-handler.ts";
import {
  errorNormalCAContract,
  errorNormalCAHandlerDependency,
} from "@framework/control-action/error-normal-ca-handler.ts";
import { NaiveNormalCARouter } from "@framework/control-action/normal/naive-router.ts";
import { gameStartC2SNotNormalCAContract } from "@common/game/defs.ts";

export function initServerNormalCARouter() {
  return new NaiveNormalCARouter({
    [errorNormalCAContract.name]: errorNormalCAHandlerDependency,
    [gameStartC2SNotNormalCAContract.name]: gameStartC2SNotNormalCAHandlerDependency,
  });
}
