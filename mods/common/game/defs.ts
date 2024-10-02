import { defineNormalCA } from "@acme/control-action/normal/defs.ts";

export const gameCreatePathname = "/games/create";
export const gameJoinPathname = "/games/join";
export const gameQuitPathname = "/games/quit";
export const gameSocketPatternPathname = "/games/socket/:token";
export const createGameSocketPathname = (token: string) => `/games/socket/${token}`;

export const gameCreateC2SNotNormalCA = defineNormalCA<undefined>("c2s-not-game-create");
