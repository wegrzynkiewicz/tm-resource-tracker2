import {
  dotEnvConfigValueExtractorDependency,
  dotEnvMapDependency,
  readDotEnvMap,
} from "@acme/config/dot-env-extractor.ts";
import { createWebServerConfigProvider } from "@acme/web/server-config.ts";
import { builtInConfigValueExtractorDependency } from "@acme/config/built-in-extractor.ts";
import { configBinderDependency } from "@acme/config/common.ts";
import { denoQueryingConfigValueExtractorDependency } from "@acme/config/deno-querying-extractor.ts";
import { denoRequestingConfigValueExtractorDependency } from "@acme/config/deno-requesting-extractor.ts";
import { configValueGetterDependency, configValueResultMapDependency } from "@acme/config/value-getter.ts";
import { configValueExtractorsDependency, configValueResolverDependency } from "@acme/config/value-resolver.ts";
import { configVariableNamePrefixDependency } from "@acme/config/variable-name.ts";
import { Context } from "@acme/dependency/context.ts";

export const mainWebServer = createWebServerConfigProvider("name");

export async function initServerConfig(context: Context): Promise<void> {
  const { resolver } = context;
  resolver.inject(configVariableNamePrefixDependency, "TM_");

  const dotEnvMap = await readDotEnvMap(".env");
  resolver.inject(dotEnvMapDependency, dotEnvMap);

  const extractors = [
    resolver.resolve(denoQueryingConfigValueExtractorDependency),
    resolver.resolve(dotEnvConfigValueExtractorDependency),
    resolver.resolve(builtInConfigValueExtractorDependency),
    resolver.resolve(denoRequestingConfigValueExtractorDependency),
  ];
  resolver.inject(configValueExtractorsDependency, extractors);

  const binder = resolver.resolve(configBinderDependency);
  binder.bind(mainWebServer.hostnameConfigContract, "0.0.0.0");
  binder.bind(mainWebServer.portConfigContract, 3008);

  const configValueResolver = resolver.resolve(configValueResolverDependency);
  const valueResultMap = await configValueResolver.resolveAll();
  resolver.inject(configValueResultMapDependency, valueResultMap);

  resolver.resolve(configValueGetterDependency);
}
