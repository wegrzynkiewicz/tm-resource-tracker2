import { BasicLogHandler } from "@acme/logger/basic-log-handler.ts";
import { prettyLogFormatterDependency } from "@acme/logger/pretty-log-formatter.ts";
import { initServerConfig } from "./config.ts";
import { initMainWebServer } from "./main.web-server.ts";
import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { initConfig } from "@acme/app/config.ts";
import { Context, createContext } from "@acme/dependency/context.ts";
import { BasicLogFilter } from "@acme/logger/basic-log-filter.ts";
import { logChannelDependency, TRACE } from "@acme/logger/defs.ts";

export async function initLogChannel(globalContext: Context): Promise<void> {
  const { resolver } = globalContext;
  const channel = resolver.resolve(logChannelDependency);
  const handler = new BasicLogHandler(
    new BasicLogFilter(TRACE),
    resolver.resolve(prettyLogFormatterDependency),
  );
  channel.on(handler.handle.bind(handler));
}

async function start() {
  const globalContext = createContext({
    identifier: {
      pid: Deno.pid,
    },
    name: "GLOBAL",
    scopes: {
      [globalScopeContract.token]: new Scope(globalScopeContract),
      [localScopeContract.token]: new Scope(localScopeContract),
    },
  });

  await initServerConfig(globalContext);
  await initConfig(globalContext);
  await initLogChannel(globalContext);
  // initTerminator(resolver);
  initMainWebServer(globalContext);
}
start();
