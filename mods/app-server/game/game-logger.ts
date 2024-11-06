import { defineDependency } from "@framework/dependency/declaration.ts";
import { loggerFactoryDependency } from "@framework/logger/factory.ts";
import { serverGameScopeToken } from "../defs.ts";
import { Context } from "@framework/dependency/context.ts";
import { serverGameIdDependency } from "./game-context.ts";

export function provideServerGameLogger(context: Context) {
  const loggerFactory = context.resolve(loggerFactoryDependency);
  const gameId = context.resolve(serverGameIdDependency);
  const logger = loggerFactory.createLogger("GAME", { gameId });
  return logger;
}

export const serverGameLoggerDependency = defineDependency({
  provider: provideServerGameLogger,
  scopeToken: serverGameScopeToken,
});
