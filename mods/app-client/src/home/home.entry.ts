import { homeControllerHandlerDependency } from "./home-controller.ts";
import { actionBinderDependency } from "../actions.ts";
import { gameCreateActionContract, gameCreateActionHandlerDependency } from "./game-create-action.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export async function initHomeController(resolver: DependencyResolver) {
  const actionBinder = resolver.resolve(actionBinderDependency);
  actionBinder.bind(gameCreateActionContract, gameCreateActionHandlerDependency);

  const controllerHandler = resolver.resolve(homeControllerHandlerDependency);
  await controllerHandler.handle();
}
