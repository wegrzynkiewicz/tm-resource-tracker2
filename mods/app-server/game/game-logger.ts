import { defineDependency } from "@acme/dependency/declaration.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";
import { serverGameScopeContract } from "../defs.ts";
import { Context } from "@acme/dependency/context.ts";
import { serverGameIdDependency } from "./game-context.ts";

export function provideServerGameLogger(context: Context) {
  const loggerFactory = context.resolve(loggerFactoryDependency);
  const gameId = context.resolve(serverGameIdDependency);
  const logger = loggerFactory.createLogger("GAME", { gameId });
  return logger;
}

export const serverGameLoggerDependency = defineDependency({
  provider: provideServerGameLogger,
  scope: serverGameScopeContract,
});
