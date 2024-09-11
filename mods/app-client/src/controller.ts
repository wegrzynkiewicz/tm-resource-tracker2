import { PathContract } from "@acme/endpoint/path.ts";
import { Scope, defineDependency } from "@acme/dependency/injection.ts";

export interface ControllerHandlerInput {
  contract: ControllerContract;
}

export interface ControllerHandler {
  handle(input: ControllerHandlerInput): Promise<void>;
}

export type ControllerInitializer = (scope: Scope, contract: ControllerContract) => Promise<Scope>;
export type ControllerImporter = () => Promise<ControllerInitializer>;

export interface ControllerContract {
  path: PathContract,
  importer: ControllerImporter,
}

export function defineController(contract: ControllerContract): ControllerContract {
  return contract;
}

export class ControllerBinder {
  private readonly contracts: ControllerContract[] = [];
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
