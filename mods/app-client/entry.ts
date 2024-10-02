import { builtInConfigValueExtractorDependency } from "@acme/config/built-in-extractor.ts";
import { configBinderDependency } from "@acme/config/common.ts";
import { configValueResultMapDependency } from "@acme/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@acme/config/value-resolver.ts";
import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { appSlotDependency } from "./src/frontend/app/app-view.ts";
import { frontendScopeContract } from "./defs.ts";
import { apiURLConfigContract } from "./src/api-url-config.ts";
import { appNameConfigContract } from "./src/frontend/app/app-name-config.ts";
import { logChannelDependency, TRACE } from "@acme/logger/defs.ts";
import { controllerRouterDependency, controllerRunnerDependency, NaiveControllerRouter } from "./src/controller.ts";
import { homeControllerImporter, homePath } from "./src/frontend/home/home-defs.ts";
import { waitingControllerImporter, waitingPath } from "./src/frontend/waiting/waiting-defs.ts";
import { Context, createContext } from "@acme/dependency/context.ts";
import { BasicLogFilter } from "@acme/logger/basic-log-filter.ts";
import { BrowserLogSubscriber } from "@acme/logger/browser-log-subscriber.ts";

export async function initLogChannel(globalContext: Context): Promise<void> {
  const { resolver } = globalContext;
  const channel = resolver.resolve(logChannelDependency);
  const subscriber = new BrowserLogSubscriber(
    new BasicLogFilter(TRACE),
  );
  channel.subscribers.add(subscriber);
}

async function initClientConfig(globalContext: Context): Promise<void> {
  const { resolver } = globalContext;
  const extractors = [
    resolver.resolve(builtInConfigValueExtractorDependency),
  ];
  resolver.inject(configValueExtractorsDependency, extractors);

  const binder = resolver.resolve(configBinderDependency);
  binder.bind(appNameConfigContract, "TM Resource Tracker v2");
  binder.bind(apiURLConfigContract, new URL("http://localhost:3008"));

  const configValueResolver = resolver.resolve(configValueResolverDependency);
  const valueResultMap = await configValueResolver.resolveAll();
  resolver.inject(configValueResultMapDependency, valueResultMap);
}

async function initFrontend(globalContext: Context): Promise<void> {
  const frontendScope = createContext({
    identifier: {},
    name: "FRONTEND",
    scopes: {
      [globalScopeContract.token]: globalContext.scopes[globalScopeContract.token],
      [frontendScopeContract.token]: new Scope(frontendScopeContract),
      [localScopeContract.token]: new Scope(localScopeContract),
    },
  });
  const { resolver } = frontendScope;

  const appSlot = resolver.resolve(appSlotDependency);
  document.body.appendChild(appSlot.$root);

  const router = new NaiveControllerRouter();
  router.addRoute(homePath, homeControllerImporter);
  router.addRoute(waitingPath, waitingControllerImporter);
  resolver.inject(controllerRouterDependency, router);

  const controllerRunner = resolver.resolve(controllerRunnerDependency);
  await controllerRunner.run(window.location.pathname);

  globalThis.addEventListener("popstate", async () => {
    await controllerRunner.run(window.location.pathname);
  });
}

async function bootstrap() {
  const globalContext = createContext({
    identifier: {},
    name: "GLOBAL",
    scopes: {
      [globalScopeContract.token]: new Scope(globalScopeContract),
      [localScopeContract.token]: new Scope(localScopeContract),
    },
  });

  await initClientConfig(globalContext);
  await initLogChannel(globalContext);
  await initFrontend(globalContext);
}

bootstrap();
