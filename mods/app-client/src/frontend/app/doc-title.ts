import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { appNameDependency } from "./app-name-config.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export function provideDocTitle(resolver: DependencyResolver) {
  const appName = resolver.resolve(appNameDependency);
  const setTitle = (title: string) => {
    document.title = `${title} - ${appName}`;
  }
  return { setTitle };
}

export const docTitleDependency = defineDependency({
  provider: provideDocTitle,
  scope: frontendScopeContract,
});
