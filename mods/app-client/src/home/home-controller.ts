import { defineDependency } from "@acme/dependency/declaration.ts";
import { ControllerHandler } from "../controller.ts";
import { HomeView, homepageViewDependency } from "./home-view.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export class HomeControllerHandler implements ControllerHandler {
  public constructor(
    private readonly view: HomeView,
  ) {}

  public async handle(): Promise<void> {
    this.view.render();
  }
}

function provideHomeControllerHandler(resolver: DependencyResolver) {
  return new HomeControllerHandler(
    resolver.resolve(homepageViewDependency),
  );
}

export const homeControllerHandlerDependency = defineDependency({
  name: "home-controller-handler",
  provider: provideHomeControllerHandler,
});
