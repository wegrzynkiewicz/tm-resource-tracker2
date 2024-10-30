import { defineDependency } from "@acme/dependency/declaration.ts";
import { controllerScopeContract, frontendScopeContract } from "./defs.ts";
import { Panic } from "@acme/useful/errors.ts";
import { Data } from "@acme/useful/types.ts";
import { Context } from "@acme/dependency/context.ts";
import { Channel } from "@acme/dom/channel.ts";

export interface Controller {
  dispose(): void;
}
export type ControllerInitializer = (context: Context, params: Data) => Promise<Controller>;
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
  public currentController: Controller | null = null;

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

    if (this.currentController) {
      this.currentController.dispose();
    }

    try {
      const initializer = await importer();
      this.currentController = await initializer(this.frontendContext, params);
    } catch (error) {
      throw new Panic("controller-initialization-failed", { pathname, error });
    }
  }
}

export function provideControllerRunner(context: Context) {
  return new ControllerRunner(
    context.resolve(controllerRouterDependency),
    context,
  );
}

export const controllerRunnerDependency = defineDependency({
  provider: provideControllerRunner,
  scope: frontendScopeContract,
});

export const controllerAbortDependency = defineDependency({
  provider: () => new Channel<[]>(),
  scope: controllerScopeContract,
});
