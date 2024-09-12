import { Channel } from "@acme/dependency/channel.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../bootstrap.ts";
import { appNameDependency } from "./app-name-config.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export class TopTitleStore extends Channel<[]> {
  public title: string;
  public constructor(
    private readonly appName: string,
  ) {
    super();
    this.title = this.appName;
  }
}

export function provideTopTitle(resolver: DependencyResolver) {
  return new TopTitleStore(
    resolver.resolve(appNameDependency),
  );
}

export const topTitleStoreDependency = defineDependency({
  name: "top-title-store",
  provider: provideTopTitle,
  scope: frontendScopeContract,
});

