import { Dependency, DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";
import { Panic } from "@acme/useful/errors.ts";
import { controllerScopeContract } from "../bootstrap.ts";
import { Scope, scopeDependency } from "@acme/dependency/scopes.ts";

export interface ActionContract<T = unknown> {
  type: string;
}

export function defineAction<T>(type: string): ActionContract<T> {
  return { type };
}

export interface ActionHandlerInput<T> {
  contract: ActionContract;
  payload: T;
}

export interface ActionHandler<T = unknown> {
  handle(input: ActionHandlerInput<T>): Promise<void>;
}

export interface ActionBinding {
  contract: ActionContract;
  dependency: Dependency<ActionHandler>
}

export class ActionBinder {
  public readonly bindings = new Map<ActionContract, ActionBinding>();
  public bind(contract: ActionContract, dependency: Dependency<ActionHandler>) {
    const binding = { contract, dependency };
    this.bindings.set(contract, binding);
  }
}

function provideActionBinder() {
  return new ActionBinder();
}
export const actionBinderDependency = defineDependency({
  kind: "action-binder",
  provider: provideActionBinder,
});

export class ActionDispatcher {
  public constructor(
    private readonly scope: Scope,
    private readonly binder: ActionBinder,
  ) {}

  public dispatch<T>(contract: ActionContract<T>, payload: T) {
    const binding = this.binder.bindings.get(contract);
    if (binding === undefined) {
      throw new Panic("no-found-action-handler", { contract: contract.type });
    }

    const { resolver } = this.scope;
    const handler = resolver.resolve(binding.dependency);
    handler.handle({ contract, payload });
  }
}

export function provideActionDispatcher(resolver: DependencyResolver) {
  return new ActionDispatcher(
    resolver.resolve(scopeDependency),
    resolver.resolve(actionBinderDependency),
  );
}
export const actionDispatcherDependency = defineDependency({
  kind: "action-dispatcher",
  provider: provideActionDispatcher,
  scope: controllerScopeContract,
});
