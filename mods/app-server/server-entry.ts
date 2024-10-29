import { BasicLogHandler } from "@acme/logger/basic-log-handler.ts";
import { prettyLogFormatterDependency } from "@acme/logger/pretty-log-formatter.ts";
import { initServerConfig } from "./config.ts";
import { initMainWebServer } from "./main.web-server.ts";
import { globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { initConfig } from "@acme/app/config.ts";
import { Context } from "@acme/dependency/context.ts";
import { BasicLogFilter } from "@acme/logger/basic-log-filter.ts";
import { logChannelDependency, TRACE } from "@acme/logger/defs.ts";

export async function initLogChannel(globalContext: Context): Promise<void> {
  const channel = globalContext.resolve(logChannelDependency);
  const handler = new BasicLogHandler(
    new BasicLogFilter(TRACE),
    globalContext.resolve(prettyLogFormatterDependency),
  );
  channel.on(handler.handle.bind(handler));
}

async function start() {
  const globalContext = new Context({
    [globalScopeContract.token]: new Scope(globalScopeContract),
  });

  await initServerConfig(globalContext);
  await initConfig(globalContext);
  await initLogChannel(globalContext);
  // initTerminator(resolver);
  initMainWebServer(globalContext);
}
start();
