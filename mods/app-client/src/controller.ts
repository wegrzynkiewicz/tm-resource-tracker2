import { defineDependency } from "@acme/dependency/declaration.ts";
import { controllerScopeContract, frontendScopeContract } from "../defs.ts";
import { Panic } from "@acme/useful/errors.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { Data } from "@acme/useful/types.ts";
import { Context, contextDependency, createContext } from "@acme/dependency/context.ts";
import { globalScopeContract, localScopeContract, Scope } from "@acme/dependency/scopes.ts";

export type ControllerInitializer = (context: Context, params: Data) => Promise<void>;
export type ControllerImporter = () => Promise<ControllerInitializer>;

export interface ControllerRouteMatch {
  importer: ControllerImporter;
  params: Data;
}

export interface ControllerRouter {
  match(pathname: string): ControllerRouteMatch | undefined;
}

export const controllerRouterDependency = defineDependency<ControllerRouter>({
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
  public currentPathname: string = "";

  public constructor(
    private readonly router: ControllerRouter,
    private readonly frontendContext: Context,
  ) {}

  public async run(pathname: string) {
    history.pushState(null, "", pathname);
    this.currentPathname = pathname;
    const route = this.router.match(pathname);
    if (route === undefined) {
      throw new Panic("no-matching-controller-found", { pathname });
    }
    const { importer, params } = route;

    const controllerContext = createContext({
      identifier: {},
      name: "CONTROLLER",
      scopes: {
        [globalScopeContract.token]: this.frontendContext.scopes[globalScopeContract.token],
        [frontendScopeContract.token]: this.frontendContext.scopes[frontendScopeContract.token],
        [controllerScopeContract.token]: new Scope(controllerScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });

    try {
      const initializer = await importer();
      await initializer(controllerContext, params);
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
  provider: provideControllerRunner,
  scope: frontendScopeContract,
});
