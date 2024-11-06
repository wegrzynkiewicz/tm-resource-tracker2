import {
  dotEnvConfigValueExtractorDependency,
  dotEnvMapDependency,
  readDotEnvMap,
} from "@framework/config/dot-env-extractor.ts";
import { createWebServerConfigProvider } from "@framework/web/server-config.ts";
import { builtInConfigValueExtractorDependency } from "@framework/config/built-in-extractor.ts";
import { configBinderDependency } from "@framework/config/common.ts";
import { denoQueryingConfigValueExtractorDependency } from "@framework/config/deno-querying-extractor.ts";
import { denoRequestingConfigValueExtractorDependency } from "@framework/config/deno-requesting-extractor.ts";
import { configValueGetterDependency, configValueResultMapDependency } from "@framework/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@framework/config/value-resolver.ts";
import { configVariableNamePrefixDependency } from "@framework/config/variable-name.ts";
import { Context } from "@framework/dependency/context.ts";

export const mainWebServer = createWebServerConfigProvider("name");

export async function initServerConfig(context: Context): Promise<void> {
  context.inject(configVariableNamePrefixDependency, "TM_");

  const dotEnvMap = await readDotEnvMap(".env");
  context.inject(dotEnvMapDependency, dotEnvMap);

  const extractors = [
    context.resolve(denoQueryingConfigValueExtractorDependency),
    context.resolve(dotEnvConfigValueExtractorDependency),
    context.resolve(builtInConfigValueExtractorDependency),
    context.resolve(denoRequestingConfigValueExtractorDependency),
  ];
  context.inject(configValueExtractorsDependency, extractors);

  const binder = context.resolve(configBinderDependency);
  binder.bind(mainWebServer.hostnameConfigContract, "0.0.0.0");
  binder.bind(mainWebServer.portConfigContract, 3008);

  const configValueResolver = context.resolve(configValueResolverDependency);
  const valueResultMap = await configValueResolver.resolveAll();
  context.inject(configValueResultMapDependency, valueResultMap);

  context.resolve(configValueGetterDependency);
}
