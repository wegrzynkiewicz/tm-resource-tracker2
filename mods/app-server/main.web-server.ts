import { gameCreateEndpointContract } from "../common/game/game-create.ts";
import { gameCreateWebHandlerDependency } from "./game/game-create-handler.ts";
import { DependencyResolver } from "@acme/dependency/injection.ts";
import { openAPIEndpointContract, openAPIWebHandlerDependency } from "@acme/endpoint/build-in/open-api.ts";
import { terminatorDependency } from "@acme/system/terminator.ts";
import { naiveServerWebRouterDependency, serverWebRouteBinderDependency, serverWebRouterDependency } from "@acme/web/routing.ts";
import { webServerScopeManagerDependency } from "@acme/web/server-scope.ts";
import { webServerDependency } from "@acme/web/server.ts";
import { mainWebServer } from "./config.ts";
import { preflightEndpointContract, preflightWebHandlerDependency } from "@acme/endpoint/build-in/preflight.ts";
import { gameReadWebHandlerDependency } from "./game/game-read-handler.ts";
import { gameReadEndpointContract } from "../common/game/game-read.ts";

export function initMainWebServer(resolver: DependencyResolver) {
  const config = resolver.resolve(mainWebServer.webConfigService);
  const serverScopeManager = resolver.resolve(webServerScopeManagerDependency);
  const webServerScope = serverScopeManager.createWebServerScope(config);

  const binder = webServerScope.resolver.resolve(serverWebRouteBinderDependency);
  binder.bind(openAPIEndpointContract, openAPIWebHandlerDependency);
  binder.bind(gameCreateEndpointContract, gameCreateWebHandlerDependency);
  binder.bind(gameReadEndpointContract, gameReadWebHandlerDependency);
  binder.bind(preflightEndpointContract, preflightWebHandlerDependency);

  const router = webServerScope.resolver.resolve(naiveServerWebRouterDependency);
  webServerScope.resolver.inject(serverWebRouterDependency, router);

  const server = webServerScope.resolver.resolve(webServerDependency);

  const terminator = resolver.resolve(terminatorDependency);
  terminator.nodes.add(server);

  return server;
}
