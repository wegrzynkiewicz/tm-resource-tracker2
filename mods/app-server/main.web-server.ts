import { gameCreateWebHandlerDependency } from "./game/game-create-endpoint-handler.ts";
import { terminatorDependency } from "@framework/system/terminator.ts";
import { webServerDependency } from "@framework/web/server.ts";
import { mainWebServer } from "./config.ts";
import { NaiveServerWebRouter } from "@framework/web/router-naive.ts";
import { serverWebRouterDependency } from "@framework/web/defs.ts";
import { webServerContextManagerDependency } from "@framework/web/server-context.ts";
import { preflightEndpointHandlerDependency } from "@framework/web/build-in/preflight.ts";
import {
  gameCreatePathname,
  gameJoinPathname,
  gameQuitPathname,
  gameReadPathname,
  gameSocketPatternPathname,
} from "@common/game/defs.ts";
import { gameQuitEndpointHandlerDependency } from "./game/game-quit-endpoint-handler.ts";
import { gameSocketEndpointHandlerDependency } from "./game/game-socket-endpoint-handler.ts";
import { gameJoinEndpointHandlerDependency } from "./game/game-join-endpoint-handler.ts";
import { Context } from "@framework/dependency/context.ts";
import { gameReadEndpointHandlerDependency } from "./game/game-read-endpoint-handler.ts";

export function initMainWebServer(context: Context) {
  const config = context.resolve(mainWebServer.webConfigService);
  const serverScopeManager = context.resolve(webServerContextManagerDependency);
  const webServerScope = serverScopeManager.createWebServerScope(config);

  const router = new NaiveServerWebRouter();
  router.addRoute("POST", gameCreatePathname, gameCreateWebHandlerDependency);
  router.addRoute("GET", gameReadPathname, gameReadEndpointHandlerDependency);
  router.addRoute("POST", gameJoinPathname, gameJoinEndpointHandlerDependency);
  router.addRoute("POST", gameQuitPathname, gameQuitEndpointHandlerDependency);
  router.addRoute("GET", gameSocketPatternPathname, gameSocketEndpointHandlerDependency);
  router.addRoute("OPTIONS", "*", preflightEndpointHandlerDependency);

  webServerScope.inject(serverWebRouterDependency, router);

  const server = webServerScope.resolve(webServerDependency);

  const terminator = context.resolve(terminatorDependency);
  terminator.nodes.add(server);

  return server;
}
