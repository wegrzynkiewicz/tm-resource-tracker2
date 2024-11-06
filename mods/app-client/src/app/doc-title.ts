import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeToken } from "../defs.ts";
import { appNameDependency } from "./app-name-config.ts";
import { Context } from "@acme/dependency/context.ts";

export function provideDocTitle(context: Context) {
  const appName = context.resolve(appNameDependency);
  const setTitle = (title: string) => {
    document.title = `${title} - ${appName}`;
  };
  return { setTitle };
}

export const docTitleDependency = defineDependency({
  provider: provideDocTitle,
  scopeToken: frontendScopeToken,
});
