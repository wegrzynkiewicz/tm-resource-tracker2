import { ServiceResolver } from "../core/dependency.ts";
import { corsOptionsEPRoute, provideCorsOptionsEPHandler } from "./cors-options-ep.ts";
import { provideCreateGameEPHandler } from "../common/game/create/ep.ts";
import { provideReadGameEPHandler, readGameEPRoute } from "../common/game/read/ep.ts";
import { provideLoggerFactory } from "../core/logger/logger-factory.ts";
import { GlobalMiddleware } from "../core/web/global-middleware.ts";
import { Router } from "../core/web/router.ts";
import { WebServer } from "../core/web/server.ts";
import { quitGameEPRoute } from "../common/game/quit/ep.ts";
import { provideQuitGameEPHandler } from "../common/game/quit/ep.ts";
import { joinGameEPRoute, provideJoinGameEPHandler } from "../common/game/join/ep.ts";
import { socketGameEPRoute } from "../common/game/socket/common.ts";
import { provideSocketGameEPHandler } from "../common/game/socket/ep.ts";
import { createGameEPRoute } from "../common/game/create/common.ts";

export function provideMainWebServerConfig() {
  return {
    hostname: "0.0.0.0",
    name: "main",
    port: 3008,
  };
}

export function provideMainWebLogger(resolver: ServiceResolver) {
  const loggerFactory = resolver.resolve(provideLoggerFactory);
  const webServerConfig = resolver.resolve(provideMainWebServerConfig);
  const logger = loggerFactory.createLogger("WEB", { webServerConfig });
  return logger;
}

export function provideMainWebRouter(resolver: ServiceResolver) {
  const router = new Router(
    resolver.resolve(provideMainWebLogger),
  );
  router.add(corsOptionsEPRoute, resolver.resolve(provideCorsOptionsEPHandler));
  router.add(createGameEPRoute, resolver.resolve(provideCreateGameEPHandler));
  router.add(readGameEPRoute, resolver.resolve(provideReadGameEPHandler));
  router.add(joinGameEPRoute, resolver.resolve(provideJoinGameEPHandler));
  router.add(quitGameEPRoute, resolver.resolve(provideQuitGameEPHandler));
  router.add(socketGameEPRoute, resolver.resolve(provideSocketGameEPHandler));
  return router;
}

export function provideWebServer(resolver: ServiceResolver) {
  const globalMiddleware = new GlobalMiddleware(
    resolver.resolve(provideMainWebRouter),
  );
  return new WebServer(
    resolver.resolve(provideMainWebServerConfig),
    globalMiddleware,
    resolver.resolve(provideMainWebLogger),
  );
}
