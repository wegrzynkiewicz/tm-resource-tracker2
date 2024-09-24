import { builtInConfigValueExtractorDependency } from "@acme/config/built-in-extractor.ts";
import { configBinderDependency } from "@acme/config/common.ts";
import { configValueResultMapDependency } from "@acme/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@acme/config/value-resolver.ts";
import { initGlobalLogChannel } from "@acme/logger/log-channel.ts";
import { globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { appSlotDependency } from "./src/app/app-view.ts";
import { frontendScopeContract } from "./bootstrap.ts";
import { apiURLConfigContract } from "./src/api-url-config.ts";
import { appNameConfigContract } from "./src/app/app-name-config.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { loggingStrategyConfigContract } from "@acme/logger/defs.ts";
import { controllerRouterDependency, controllerRunnerDependency, NaiveControllerRouter } from "./src/controller.ts";
import { homeControllerImporter, homePath } from "./src/home/home-defs.ts";
import { waitingControllerImporter, waitingPath } from "./src/waiting/waiting-defs.ts";

async function initClientConfig(resolver: DependencyResolver): Promise<void> {
  const extractors = [
    resolver.resolve(builtInConfigValueExtractorDependency),
  ];
  resolver.inject(configValueExtractorsDependency, extractors);

  const binder = resolver.resolve(configBinderDependency);
  binder.bind(appNameConfigContract, "TM Resource Tracker v2");
  binder.bind(loggingStrategyConfigContract, "BROWSER-DEV");
  binder.bind(apiURLConfigContract, new URL("http://localhost:3008"));

  const configValueResolver = resolver.resolve(configValueResolverDependency);
  const valueResultMap = await configValueResolver.resolveAll();
  resolver.inject(configValueResultMapDependency, valueResultMap);
}

async function initFrontend(parentResolver: DependencyResolver): Promise<void> {
  const frontendScope = new Scope(frontendScopeContract);
  const resolver = new DependencyResolver([...parentResolver.scopes, frontendScope]);

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

async function start() {
  const globalScope = new Scope(globalScopeContract);
  const resolver = new DependencyResolver([globalScope]);

  await initClientConfig(resolver);
  await initGlobalLogChannel(resolver);
  await initFrontend(resolver);
}
start();
