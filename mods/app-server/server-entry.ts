import { initServerConfig } from "./config.ts";
import { initGlobalLogChannel } from "@acme/logger/log-channel.ts";
import { initMainWebServer } from "./main.web-server.ts";
import { Scope, globalScopeContract } from "@acme/dependency/scopes.ts";
import { initConfig } from "@acme/app/config.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { loggerDependency } from "@acme/logger/defs.ts";
import { loggerFactoryDependency } from "@acme/logger/factory.ts";

async function start() {
  const globalScope = new Scope(globalScopeContract);
  const resolver = new DependencyResolver([globalScope]);
  
  await initServerConfig(resolver);
  await initConfig(resolver);
  await initGlobalLogChannel(resolver);

  const loggerFactory = resolver.resolve(loggerFactoryDependency);
  const logger = loggerFactory.createLogger("GLOBAL", { pid: Deno.pid });
  resolver.inject(loggerDependency, logger);
  
  // initTerminator(resolver);
  initMainWebServer(resolver);
}
start();
