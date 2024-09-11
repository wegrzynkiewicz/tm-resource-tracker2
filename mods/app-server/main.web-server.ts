import { gameCreateEndpointContract } from "../common/game/create/common.ts";
import { gameCreateWebHandlerDependency } from "./game/game-create-endpoint.ts";
import { DependencyResolver } from "@acme/dependency/injection.ts";
import { openAPIEndpointContract, openAPIWebHandlerDependency } from "@acme/endpoint/build-in/open-api.ts";
import { terminatorDependency } from "@acme/system/terminator.ts";
import { NaiveRouterFactory, serverWebRouteBinderDependency, serverWebRouterDependency } from "@acme/web/routing.ts";
import { webServerScopeManagerDependency } from "@acme/web/server-scope.ts";
import { webServerDependency } from "@acme/web/server.ts";
import { mainWebServer } from "./config.ts";
import { preflightEndpointContract, preflightWebHandlerDependency } from "@acme/endpoint/build-in/preflight.ts";

export function initMainWebServer(resolver: DependencyResolver) {
  const config = resolver.resolve(mainWebServer.webConfigService);
  const serverScopeManager = resolver.resolve(webServerScopeManagerDependency);
  const webServerScope = serverScopeManager.createWebServerScope(config);

  const binder = webServerScope.resolver.resolve(serverWebRouteBinderDependency);
  binder.bind(openAPIEndpointContract, openAPIWebHandlerDependency);
  binder.bind(gameCreateEndpointContract, gameCreateWebHandlerDependency);
  binder.bind(preflightEndpointContract, preflightWebHandlerDependency);

  const routerFactory = new NaiveRouterFactory(binder);
  const router = routerFactory.create();
  webServerScope.resolver.inject(serverWebRouterDependency, router);

  const server = webServerScope.resolver.resolve(webServerDependency);

  const terminator = resolver.resolve(terminatorDependency);
  terminator.nodes.add(server);

  return server;
}
