import { Channel } from "@acme/dom/channel.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { appNameDependency } from "./app-name-config.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export class TopTitleStore {
  public readonly updates = new Channel<[]>();

  public constructor(
    public title: string,
  ) {}

  public setTitle(title: string) {
    this.title = title;
    this.updates.emit();
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
