import { defineDependency } from "@acme/dependency/declaration.ts";
import { controllerScopeContract, frontendScopeContract } from "../defs.ts";
import { Panic } from "@acme/useful/errors.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { Data } from "@acme/useful/types.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";

export type ControllerInitializer = (context: Context, params: Data) => Promise<void>;
export type ControllerImporter = () => Promise<ControllerInitializer>;

export interface ControllerRouteMatch {
  importer: ControllerImporter;
  params: Data,
}

export interface ControllerRouter {
  match(pathname: string): ControllerRouteMatch | undefined;
}

export const controllerRouterDependency = defineDependency<ControllerRouter>({
  name: "controller-router",
  scope: frontendScopeContract,
});

export interface NaiveControllerRoute {
  importer: ControllerImporter;
  urlPattern: URLPattern;
}

export class NaiveControllerRouter implements ControllerRouter {
  public readonly routes: NaiveControllerRoute[] = [];

  public addRoute(pathname: string, importer: ControllerImporter) {
    const urlPattern = new URLPattern({ pathname });
    this.routes.push({ importer, urlPattern });
  }

  public match(pathname: string): ControllerRouteMatch | undefined {
    for (const { importer, urlPattern } of this.routes) {
      const result = urlPattern.exec(pathname, window.location.origin);
      if (result === null) {
        continue;
      }
      const params = result.pathname.groups;
      return { importer, params };
    }
  }
}

export class ControllerRunner {
  public constructor(
    private readonly router: ControllerRouter,
    private readonly frontendContext: Context,
  ) {}

  public async run(path: string) {
    history.pushState(null, "", path);
    const route = this.router.match(path);
    if (route === undefined) {
      throw new Panic("no-matching-controller-found", { path });
    }
    const { importer, params } = route;

    try {
      const initializer = await importer();
      await initializer(this.frontendContext, params);
    } catch (error) {
      throw new Panic("controller-initialization-failed", { controller: importer.name, error });
    }
  }
}

export function provideControllerRunner(resolver: DependencyResolver) {
  return new ControllerRunner(
    resolver.resolve(controllerRouterDependency),
    resolver.resolve(contextDependency),
  );
}

export const controllerRunnerDependency = defineDependency({
  name: "controller-runner",
  provider: provideControllerRunner,
  scope: frontendScopeContract,
});
