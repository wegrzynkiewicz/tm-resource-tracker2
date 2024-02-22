import { ServiceResolver } from "../../common/dependency.ts";
import { corsOptionsEPRoute, provideCorsOptionsEPHandler } from "./cors-options-ep.ts";
import { provideCreateGameEPHandler } from "../../actions/game/create/ep.ts";
import { provideReadGameEPHandler, readGameEPRoute } from "../../actions/game/read/ep.ts";
import { provideLoggerFactory } from "../../common/logger/logger-factory.ts";
import { GlobalMiddleware } from "../../common/web/global-middleware.ts";
import { Router } from "../../common/web/router.ts";
import { WebServer } from "../../common/web/server.ts";
import { quitGameEPRoute } from "../../actions/game/quit/ep.ts";
import { provideQuitGameEPHandler } from "../../actions/game/quit/ep.ts";
import { joinGameEPRoute, provideJoinGameEPHandler } from "../../actions/game/join/ep.ts";
import { socketGameEPRoute } from "../../actions/game/socket/common.ts";
import { provideSocketGameEPHandler } from "../../actions/game/socket/ep.ts";
import { createGameEPRoute } from "../../actions/game/create/common.ts";

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
