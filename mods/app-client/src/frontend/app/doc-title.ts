import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { appNameDependency } from "./app-name-config.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export class DocTitle {
  public constructor(
    private appName: string,
  ) {}

  public setTitle(title: string) {
    document.title = `${title} - ${this.appName}`;
  }
}

export function provideDocTitle(resolver: DependencyResolver) {
  return new DocTitle(
    resolver.resolve(appNameDependency),
  );
}

export const docTitleDependency = defineDependency({
  name: "doc-title",
  provider: provideDocTitle,
  scope: frontendScopeContract,
});
