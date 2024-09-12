import { defineDependency, DependencyResolver } from "@acme/dependency/declaration.ts";
import { div } from "@acme/dom/nodes.ts";
import { AppView, appViewDependency } from "./app/app-view.ts";
import { frontendScopeContract } from "../bootstrap.ts";

export class LoadingView {
  public readonly $root = div("loading", "Loading...");

  public constructor(
    private readonly app: AppView,
  ) {}

  public render() {
    this.app.contentSlot.attach(this.$root);
    this.app.render();
  }
}

export function provideLoadingView(resolver: DependencyResolver) {
  return new LoadingView(
    resolver.resolve(appViewDependency),
  );
}
export const loadingViewDependency = defineDependency({
  name: "loading-view",
  provider: provideLoadingView,
  scope: frontendScopeContract,
});
