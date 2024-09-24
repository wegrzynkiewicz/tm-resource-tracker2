import { defineDependency, Dependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { Scope } from "@acme/dependency/scopes.ts";
import { Panic } from "@acme/useful/errors.ts";
import { controllerScopeContract } from "../bootstrap.ts";

export interface ActionContract<T = unknown> {
  type: string;
}

export function defineAction<T>(type: string): ActionContract<T> {
  return { type };
}

export interface ActionHandlerInput<T> {
  contract: ActionContract;
  data: T;
}

export interface ActionHandler<T = unknown> {
  handle(input: ActionHandlerInput<T>): Promise<void>;
}

export interface ActionBinding {
  contract: ActionContract;
  dependency: Dependency<ActionHandler>;
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
  name: "action-binder",
  provider: provideActionBinder,
});

export class ActionDispatcher {
  public constructor(
    private readonly binder: ActionBinder,
    private readonly resolver: DependencyResolver,
  ) {}

  public dispatch<T>(contract: ActionContract<T>, data: T) {
    const binding = this.binder.bindings.get(contract);
    if (binding === undefined) {
      throw new Panic("no-found-action-handler", { contract: contract.type });
    }
    const handler = this.resolver.resolve(binding.dependency);
    handler.handle({ contract, data });
  }
}

export function provideActionDispatcher(resolver: DependencyResolver) {
  return new ActionDispatcher(
    resolver.resolve(actionBinderDependency),
    resolver,
  );
}
export const actionDispatcherDependency = defineDependency({
  name: "action-dispatcher",
  provider: provideActionDispatcher,
  scope: controllerScopeContract,
});
