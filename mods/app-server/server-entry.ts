import { initServerConfig } from "./config.ts";
import { initGlobalLogChannel } from "@acme/logger/log-channel.ts";
import { initMainWebServer } from "./main.web-server.ts";
import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { initConfig } from "@acme/app/config.ts";
import { createContext } from "@acme/dependency/context.ts";

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
  const { resolver } = globalContext;

  await initServerConfig(resolver);
  await initConfig(resolver);
  await initGlobalLogChannel(resolver);
  // initTerminator(resolver);
  initMainWebServer(resolver);
}
start();
