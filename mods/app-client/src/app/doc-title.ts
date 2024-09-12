import { DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";
import { frontendScopeContract } from "../../bootstrap.ts";
import { appNameDependency } from "./app-name-config.ts";

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
  kind: "doc-title",
  provider: provideDocTitle,
  scope: frontendScopeContract,
});

