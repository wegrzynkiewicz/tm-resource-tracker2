import { BasicLogHandler } from "@framework/logger/basic-log-handler.ts";
import { prettyLogFormatterDependency } from "@framework/logger/pretty-log-formatter.ts";
import { initServerConfig } from "./config.ts";
import { initMainWebServer } from "./main.web-server.ts";
import { globalScopeToken, Scope } from "@framework/dependency/scopes.ts";
import { initConfig } from "@framework/app/config.ts";
import { Context } from "@framework/dependency/context.ts";
import { BasicLogFilter } from "@framework/logger/basic-log-filter.ts";
import { logChannelDependency, TRACE } from "@framework/logger/defs.ts";

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
    [globalScopeToken]: new Scope(),
  });

  await initServerConfig(globalContext);
  await initConfig(globalContext);
  await initLogChannel(globalContext);
  // initTerminator(resolver);
  initMainWebServer(globalContext);
}
start();
