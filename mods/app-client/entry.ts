import { BrowserLogHandler } from "@framework/logger/browser-log-handler.ts";
import { builtInConfigValueExtractorDependency } from "@framework/config/built-in-extractor.ts";
import { configBinderDependency } from "@framework/config/common.ts";
import { configValueResultMapDependency } from "@framework/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@framework/config/value-resolver.ts";
import { globalScopeToken, Scope } from "@framework/dependency/scopes.ts";
import { appSlotDependency } from "./src/app/app-slot.ts";
import { frontendScopeToken } from "./src/defs.ts";
import { apiURLConfigContract } from "./src/api-url-config.ts";
import { appNameConfigContract } from "./src/app/app-name-config.ts";
import { logChannelDependency, TRACE } from "@framework/logger/defs.ts";
import { controllerRouterDependency, controllerRunnerDependency } from "./src/controller.ts";
import { homePath, initControllerRouter } from "./src/routes.ts";
import { Context } from "@framework/dependency/context.ts";
import { BasicLogFilter } from "@framework/logger/basic-log-filter.ts";

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
    [globalScopeToken]: globalContext.scopes[globalScopeToken],
    [frontendScopeToken]: new Scope(),
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
    [globalScopeToken]: new Scope(),
  });

  await initClientConfig(globalContext);
  await initLogChannel(globalContext);
  await initFrontend(globalContext);
}

bootstrap();
