import { defineNormalCA } from "@acme/control-action/normal/defs.ts";
import { GameSyncS2CNotDTO } from "./game-sync-s2c-not-dto.layout.compiled.ts";

export const gameCreatePathname = "/games/create";
export const gameReadPathname = "/games/read";
export const gameJoinPathname = "/games/join";
export const gameQuitPathname = "/games/quit";
export const gameSocketPatternPathname = "/games/socket/:token";
export const createGameSocketPathname = (token: string) => `/games/socket/${token}`;

export const gameStartC2SNotNormalCAContract = defineNormalCA<undefined>("c2s-not-game-start");

export const gameSyncS2CNotNormalCAContract = defineNormalCA<GameSyncS2CNotDTO>("s2c-not-game-sync");
