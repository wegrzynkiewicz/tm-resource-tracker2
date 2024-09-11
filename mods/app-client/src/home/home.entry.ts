import { homeControllerHandlerDependency } from "./home-controller.ts";
import { actionBinderDependency } from "../actions.ts";
import { gameCreateActionContract, gameCreateActionHandlerDependency } from "./game-create-action.ts";
import { Scope } from "@acme/dependency/scopes.ts";

export async function initHomeController(controllerScope: Scope): Promise<Scope> {
  const { resolver } = controllerScope;

  const actionBinder = resolver.resolve(actionBinderDependency);
  actionBinder.bind(gameCreateActionContract, gameCreateActionHandlerDependency);

  const controllerHandler = resolver.resolve(homeControllerHandlerDependency);
  await controllerHandler.handle();

  return controllerScope;
}
