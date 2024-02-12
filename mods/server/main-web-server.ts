import { ServiceResolver } from "../common/dependency.ts";
import { corsOptionsEPRoute, provideCorsOptionsEPHandler } from "./features/cors-options-ep.ts";
import { createGameEPRoute, provideCreateGameEPHandler } from "./features/create-game-ep.ts";
import { provideReadGameEPHandler, readGameEPRoute } from "./features/read-game-ep.ts";
import { provideMainLoggerFactory } from "./logger/logger-factory.ts";
import { GlobalMiddleware } from "./web/global-middleware.ts";
import { Router } from "./web/router.ts";
import { WebServer } from "./web/server.ts";

export function provideMainWebServerConfig() {
  return {
    hostname: "0.0.0.0",
    name: "main",
    port: 3008,
  };
}

export function provideMainWebRouter(resolver: ServiceResolver) {
  const router = new Router();
  router.add(corsOptionsEPRoute, resolver.resolve(provideCorsOptionsEPHandler));
  router.add(createGameEPRoute, resolver.resolve(provideCreateGameEPHandler));
  router.add(readGameEPRoute, resolver.resolve(provideReadGameEPHandler));
  return router;
}

export function provideWebServer(resolver: ServiceResolver) {
  const webServerConfig = resolver.resolve(provideMainWebServerConfig);
  const globalMiddleware = new GlobalMiddleware(
    resolver.resolve(provideMainWebRouter),
  );
  const loggerFactory = resolver.resolve(provideMainLoggerFactory);
  const logger = loggerFactory.createLogger("WEB", { webServerConfig });
  return new WebServer(
    webServerConfig,
    globalMiddleware,
    logger,
  );
}
