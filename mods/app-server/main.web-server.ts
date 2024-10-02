import { gameCreateWebHandlerDependency } from "./game/game-create-handler.ts";
import { terminatorDependency } from "@acme/system/terminator.ts";
import { webServerDependency } from "@acme/web/server.ts";
import { mainWebServer } from "./config.ts";
import { NaiveServerWebRouter } from "@acme/web/router-naive.ts";
import { serverWebRouterDependency } from "@acme/web/defs.ts";
import { webServerContextManagerDependency } from "@acme/web/server-context.ts";
import { preflightEndpointHandlerDependency } from "@acme/web/build-in/preflight.ts";
import {
  gameCreatePathname,
  gameJoinPathname,
  gameQuitPathname,
  gameSocketPatternPathname,
} from "../common/game/defs.ts";
import { gameQuitEndpointHandlerDependency } from "./game/game-quit-handler.ts";
import { gameSocketEndpointHandlerDependency } from "./game/game-socket-handler.ts";
import { gameJoinEndpointHandlerDependency } from "./game/game-join-handler.ts";
import { Context } from "@acme/dependency/context.ts";

export function initMainWebServer(context: Context) {
  const { resolver } = context;
  const config = resolver.resolve(mainWebServer.webConfigService);
  const serverScopeManager = resolver.resolve(webServerContextManagerDependency);
  const webServerScope = serverScopeManager.createWebServerScope(config);

  const router = new NaiveServerWebRouter();
  router.addRoute("POST", gameCreatePathname, gameCreateWebHandlerDependency);
  router.addRoute("POST", gameJoinPathname, gameJoinEndpointHandlerDependency);
  router.addRoute("POST", gameQuitPathname, gameQuitEndpointHandlerDependency);
  router.addRoute("GET", gameSocketPatternPathname, gameSocketEndpointHandlerDependency);
  router.addRoute("OPTIONS", "*", preflightEndpointHandlerDependency);

  webServerScope.resolver.inject(serverWebRouterDependency, router);

  const server = webServerScope.resolver.resolve(webServerDependency);

  const terminator = resolver.resolve(terminatorDependency);
  terminator.nodes.add(server);

  return server;
}
