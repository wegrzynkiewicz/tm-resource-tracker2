import { initServerConfig } from "./config.ts";
import { initGlobalLogChannel } from "@acme/logger/log-channel.ts";
import { initMainWebServer } from "./main.web-server.ts";
import { Scope, globalScopeContract } from "@acme/dependency/scopes.ts";

async function start() {
  const { resolver } = new Scope(globalScopeContract, { pid: Deno.pid }, null);

  await initServerConfig(resolver);
  await initGlobalLogChannel(resolver);
  // initTerminator(resolver);
  initMainWebServer(resolver);
}
start();
