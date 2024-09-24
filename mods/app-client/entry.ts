import { builtInConfigValueExtractorDependency } from "@acme/config/built-in-extractor.ts";
import { configBinderDependency } from "@acme/config/common.ts";
import { configValueResultMapDependency } from "@acme/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@acme/config/value-resolver.ts";
import { initGlobalLogChannel } from "@acme/logger/log-channel.ts";
import { globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { appSlotDependency } from "./src/app/app-view.ts";
import { controllerBinderDependency, controllerRunnerDependency } from "./src/controller.ts";
import { homeControllerContract } from "./src/home/home-defs.ts";
import { frontendScopeContract } from "./bootstrap.ts";
import { apiURLConfigContract } from "./src/api-url-config.ts";
import { waitingControllerContract } from "./src/waiting/waiting-defs.ts";
import { appNameConfigContract } from "./src/app/app-name-config.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { loggingStrategyConfigContract } from "@acme/logger/defs.ts";

async function initClientConfig(resolver: DependencyResolver): Promise<void> {
  const extractors = [
    resolver.resolve(builtInConfigValueExtractorDependency),
  ];
  resolver.inject(configValueExtractorsDependency, extractors);

  const binder = resolver.resolve(configBinderDependency);
  binder.bind(appNameConfigContract, "TM Resource Tracker v2");
  binder.bind(loggingStrategyConfigContract, "BROWSER-DEV");
  binder.bind(apiURLConfigContract, "http://localhost:3008");

  const configValueResolver = resolver.resolve(configValueResolverDependency);
  const valueResultMap = await configValueResolver.resolveAll();
  resolver.inject(configValueResultMapDependency, valueResultMap);
}

async function initFrontend(parentResolver: DependencyResolver): Promise<void> {
  const frontendScope = new Scope(frontendScopeContract);
  const resolver = new DependencyResolver([...parentResolver.scopes, frontendScope]);

  const appSlot = resolver.resolve(appSlotDependency);
  document.body.appendChild(appSlot.$root);

  const controllerBinder = resolver.resolve(controllerBinderDependency);
  controllerBinder.bind(homeControllerContract);
  controllerBinder.bind(waitingControllerContract);

  const controllerRunner = resolver.resolve(controllerRunnerDependency);
  await controllerRunner.bootstrap(window.location.href);

  globalThis.addEventListener("popstate", async () => {
    await controllerRunner.bootstrap(window.location.href);
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
