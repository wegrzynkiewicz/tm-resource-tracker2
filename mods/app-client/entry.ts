import { builtInConfigValueExtractorDependency } from "@acme/config/built-in-extractor.ts";
import { configBinderDependency } from "@acme/config/common.ts";
import { configValueResultMapDependency } from "@acme/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@acme/config/value-resolver.ts";
import { DependencyResolver } from "@acme/dependency/injection.ts";
import { initGlobalLogChannel } from "@acme/logger/log-channel.ts";
import { loggingStrategyConfigContract } from "@acme/logger/logging-strategy-config.ts";
import { Scope, globalScopeContract } from "@acme/dependency/scopes.ts";
import { appSlotDependency } from "./src/app/app-view.ts";
import { controllerBinderDependency, controllerRunnerDependency } from "./src/controller.ts";
import { homeControllerContract } from "./src/home/common.ts";
import { frontendScopeContract } from "./bootstrap.ts";
import { apiURLConfigContract } from "./src/api-url-config.ts";
import { waitingControllerContract } from "./src/waiting/common.ts";
import { appNameConfigContract } from "./src/app/app-name-config.ts";

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

async function initFrontend(frontendScope: Scope): Promise<void> {
  const { resolver } = frontendScope;

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
  const globalScope = new Scope(globalScopeContract, {}, null);
  const { resolver } = globalScope;

  await initClientConfig(resolver);
  await initGlobalLogChannel(resolver);

  const frontendScope = new Scope(frontendScopeContract, {}, globalScope);
  await initFrontend(frontendScope);
}
start();
