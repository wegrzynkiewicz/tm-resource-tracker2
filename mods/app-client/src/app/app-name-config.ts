import { createConfigValueDependency, defineConfig } from "@framework/config/common.ts";
import { parseNotEmptyString } from "@framework/layout/runtime/parsers.ts";

export const appNameConfigContract = defineConfig("app-name", parseNotEmptyString);
export const appNameDependency = createConfigValueDependency(appNameConfigContract);
