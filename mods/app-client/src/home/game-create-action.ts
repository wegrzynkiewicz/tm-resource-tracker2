import { MyPlayerDTO } from "../../../common/player/common.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { ActionHandlerInput } from "../actions.ts";
import { ActionHandler, defineAction } from "../actions.ts";
import { controllerScopeContract } from "../../bootstrap.ts";
import { ControllerRunner, controllerRunnerDependency } from "../controller.ts";
import { waitingControllerContract } from "../waiting/common.ts";
import { ClientGameManager, clientGameManagerDependency } from "../game/game-manager.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export const gameCreateActionContract = defineAction<MyPlayerDTO>("game-create");

export class GameCreateActionHandler implements ActionHandler<MyPlayerDTO> {
  public constructor(
    private readonly gameManager: ClientGameManager,
    private readonly controllerRunner: ControllerRunner,
  ) {}

  public async handle({ data }: ActionHandlerInput<MyPlayerDTO>): Promise<void> {
    await this.gameManager.createClientGame(data);
    await this.controllerRunner.run(waitingControllerContract, {});
  }
}

export function provideGameCreateActionHandler(resolver: DependencyResolver): ActionHandler<MyPlayerDTO> {
  return new GameCreateActionHandler(
    resolver.resolve(clientGameManagerDependency),
    resolver.resolve(controllerRunnerDependency),
  );
}

export const gameCreateActionHandlerDependency = defineDependency({
  name: "game-create-action-handler",
  provider: provideGameCreateActionHandler,
  scope: controllerScopeContract,
});
