import { defineDependency } from "@acme/dependency/declaration.ts";
import { ActionHandlerInput } from "../actions.ts";
import { ActionHandler, defineAction } from "../actions.ts";
import { controllerScopeContract } from "../../bootstrap.ts";
import { ControllerRunner, controllerRunnerDependency } from "../controller.ts";
import { ClientGameManager, clientGameManagerDependency } from "../game/game-manager.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { MyPlayerUpdate } from "../../../common/player/player.layout.compiled.ts";
import { waitingPath } from "../waiting/waiting-defs.ts";

export const gameCreateActionContract = defineAction<MyPlayerUpdate>("game-create");

export class GameCreateActionHandler implements ActionHandler<MyPlayerUpdate> {
  public constructor(
    private readonly gameManager: ClientGameManager,
    private readonly controllerRunner: ControllerRunner,
  ) {}

  public async handle({ data }: ActionHandlerInput<MyPlayerUpdate>): Promise<void> {
    await this.gameManager.createClientGame(data);
    await this.controllerRunner.run(waitingPath);
  }
}

export function provideGameCreateActionHandler(resolver: DependencyResolver): ActionHandler<MyPlayerUpdate> {
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
