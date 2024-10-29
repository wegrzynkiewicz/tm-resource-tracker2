import { duplexScopeContract } from "@acme/dependency/scopes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";
import { Context } from "@acme/dependency/context.ts";
import { serverPlayerIdDependency } from "./player-context.ts";
import { duplexIdDependency } from "./defs.ts";
import { serverGameIdDependency } from "../game/game-context.ts";

export function provideServerPlayerDuplexLogger(context: Context) {
  const loggerFactory = context.resolve(loggerFactoryDependency);
  const gameId = context.resolve(serverGameIdDependency);
  const playerId = context.resolve(serverPlayerIdDependency);
  const duplexId = context.resolve(duplexIdDependency);
  const logger = loggerFactory.createLogger("GAME", { duplexId, gameId, playerId });
  return logger;
}

export const serverPlayerDuplexLoggerDependency = defineDependency({
  provider: provideServerPlayerDuplexLogger,
  scope: duplexScopeContract,
});
