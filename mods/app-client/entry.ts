import { BrowserLogHandler } from "@acme/logger/browser-log-handler.ts";
import { builtInConfigValueExtractorDependency } from "@acme/config/built-in-extractor.ts";
import { configBinderDependency } from "@acme/config/common.ts";
import { configValueResultMapDependency } from "@acme/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@acme/config/value-resolver.ts";
import { globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { appSlotDependency } from "./src/app/app-slot.ts";
import { frontendScopeContract } from "./src/defs.ts";
import { apiURLConfigContract } from "./src/api-url-config.ts";
import { appNameConfigContract } from "./src/app/app-name-config.ts";
import { logChannelDependency, TRACE } from "@acme/logger/defs.ts";
import { controllerRouterDependency, controllerRunnerDependency } from "./src/controller.ts";
import { homePath, initControllerRouter } from "./src/routes.ts";
import { Context } from "@acme/dependency/context.ts";
import { BasicLogFilter } from "@acme/logger/basic-log-filter.ts";

async function initLogChannel(globalContext: Context): Promise<void> {
  const channel = globalContext.resolve(logChannelDependency);
  const handler = new BrowserLogHandler(
    new BasicLogFilter(TRACE),
  );
  channel.on(handler.handle.bind(handler));
}

async function initClientConfig(globalContext: Context): Promise<void> {
  const extractors = [
    globalContext.resolve(builtInConfigValueExtractorDependency),
  ];
  globalContext.inject(configValueExtractorsDependency, extractors);

  const binder = globalContext.resolve(configBinderDependency);
  binder.bind(appNameConfigContract, "TM Resource Tracker v2");
  binder.bind(apiURLConfigContract, new URL("http://localhost:3008"));

  const configValueResolver = globalContext.resolve(configValueResolverDependency);
  const valueResultMap = await configValueResolver.resolveAll();
  globalContext.inject(configValueResultMapDependency, valueResultMap);
}

async function initFrontend(globalContext: Context): Promise<void> {
  const frontendContext = new Context({
    [globalScopeContract.token]: globalContext.scopes[globalScopeContract.token],
    [frontendScopeContract.token]: new Scope(frontendScopeContract),
  });

  const appSlot = frontendContext.resolve(appSlotDependency);
  document.body.appendChild(appSlot.$root);

  const router = initControllerRouter();
  frontendContext.inject(controllerRouterDependency, router);

  const controllerRunner = frontendContext.resolve(controllerRunnerDependency);
  try {
    await controllerRunner.run(window.location.pathname);
  } catch {
    await controllerRunner.run(homePath);
  }

  globalThis.addEventListener("popstate", async () => {
    await controllerRunner.run(window.location.pathname);
  });
}

async function bootstrap() {
  const globalContext = new Context({
    [globalScopeContract.token]: new Scope(globalScopeContract),
  });

  await initClientConfig(globalContext);
  await initLogChannel(globalContext);
  await initFrontend(globalContext);
}

bootstrap();
