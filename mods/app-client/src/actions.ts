import { defineDependency, Dependency } from "@acme/dependency/declaration.ts";
import { Context } from "@acme/dependency/context.ts";
import { Scope } from "@acme/dependency/scopes.ts";
import { Panic } from "@acme/useful/errors.ts";
import { controllerScopeContract } from "../defs.ts";

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
  provider: provideActionBinder,
});

export class ActionDispatcher {
  public constructor(
    private readonly binder: ActionBinder,
    private readonly context: Context,
  ) {}

  public dispatch<T>(contract: ActionContract<T>, data: T) {
    const binding = this.binder.bindings.get(contract);
    if (binding === undefined) {
      throw new Panic("no-found-action-handler", { contract: contract.type });
    }
    const handler = this.context.resolve(binding.dependency);
    handler.handle({ contract, data });
  }
}

export function provideActionDispatcher(context: Context) {
  return new ActionDispatcher(
    context.resolve(actionBinderDependency),
    resolver,
  );
}
export const actionDispatcherDependency = defineDependency({
  provider: provideActionDispatcher,
  scopeToken: controllerScopeContract,
});
