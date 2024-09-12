import { InferPathParams, PathContract } from "@acme/endpoint/path.ts";
import { DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";
import { Scope, scopeDependency } from "@acme/dependency/scopes.ts";
import { controllerScopeContract, frontendScopeContract } from "../bootstrap.ts";
import { Panic } from "@acme/useful/errors.ts";

export interface ControllerHandler {
  handle(contract: ControllerContract): Promise<void>;
}

export type ControllerInitializer = (scope: Scope, contract: ControllerContract) => Promise<void>;
export type ControllerImporter = () => Promise<ControllerInitializer>;

export interface ControllerProps {
  path: PathContract,
}

export interface ControllerContract<TProps extends ControllerProps = ControllerProps> {
  name: string,
  path: TProps["path"],
  importer: ControllerImporter,
}

export function defineController(contract: ControllerContract): ControllerContract {
  return contract;
}

export class ControllerBinder {
  public readonly contracts: ControllerContract[] = [];
  public bind(contract: ControllerContract) {
    this.contracts.push(contract);
  }
}

function provideControllerBinder() {
  return new ControllerBinder();
}
export const controllerBinderDependency = defineDependency({
  kind: "controller-binder",
  provider: provideControllerBinder,
});

export class ControllerRunner {
  public constructor(
    private readonly scope: Scope,
    private readonly binder: ControllerBinder,
  ) {}

  public async run<TProps extends ControllerProps>(
    contract: ControllerContract<TProps>, 
    pathParams: InferPathParams<TProps["path"]>,
  ) {
    history.pushState(pathParams, "", contract.path.create(pathParams));
    await this.init(contract);
  }

  public async init<TProps extends ControllerProps>(
    contract: ControllerContract<TProps>, 
  ) {
    const controllerScope = new Scope(controllerScopeContract, { controller: contract.name }, this.scope);
    try {
      const initializer = await contract.importer();
      await initializer(controllerScope, contract);
    } catch (error) {
      throw new Panic("controller-initialization-failed", { controller: contract.name, error });
    }
  }

  public async bootstrap(path: string) {
    for (const contract of this.binder.contracts) {
      if (contract.path.urlPattern.test(path)) {
        await this.init(contract);
        return;
      }
    }
    throw new Panic("no-matching-controller-found", { path });
  }
}

export function provideControllerRunner(resolver: DependencyResolver) {
  return new ControllerRunner(
    resolver.resolve(scopeDependency),
    resolver.resolve(controllerBinderDependency),
  );
}
export const controllerRunnerDependency = defineDependency({
  kind: "controller-runner",
  provider: provideControllerRunner,
  scope: frontendScopeContract,
});
