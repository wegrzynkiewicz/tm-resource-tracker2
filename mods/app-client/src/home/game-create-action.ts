import { MyPlayerDTO } from "../../../common/player/common.ts";
import { DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";
import { ActionHandlerInput } from "../actions.ts";
import { ActionHandler, defineAction } from "../actions.ts";
import { apiRequestMakerDependency } from "../api-request-maker.ts";
import { RequestMaker } from "../request-maker.ts";
import { gameCreateEndpointContract } from "../../../common/game/create/common.ts";
import { controllerScopeContract } from "../../bootstrap.ts";

export const gameCreateActionContract = defineAction<MyPlayerDTO>("game-create");

export class GameCreateActionHandler implements ActionHandler<MyPlayerDTO> {
  public constructor(
    private readonly apiRequestMaker: RequestMaker,
  ) {}

  public async handle({ payload }: ActionHandlerInput<MyPlayerDTO>): Promise<void> {
    const { response, data } = await this.apiRequestMaker.makeRequest(gameCreateEndpointContract, payload, {});
    localStorage.setItem("token", response.token);
    this.clientGameContextManager.createClientGameContext(response);
  }
}

export function provideGameCreateActionHandler(resolver: DependencyResolver): ActionHandler<MyPlayerDTO> {
  return new GameCreateActionHandler(
    resolver.resolve(apiRequestMakerDependency),
  );
}
export const gameCreateActionHandlerDependency = defineDependency({
  kind: "game-create-action-handler",
  provider: provideGameCreateActionHandler,
  scope: controllerScopeContract,
});
