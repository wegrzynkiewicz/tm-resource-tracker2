import { Channel } from "@acme/dependency/channel.ts";
import { DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";
import { frontendScopeContract } from "../../bootstrap.ts";
import { appNameDependency } from "./app-name-config.ts";

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
  kind: "top-title-store",
  provider: provideTopTitle,
  scope: frontendScopeContract,
});

