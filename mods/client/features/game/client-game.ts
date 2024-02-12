import { Breaker } from "../../../common/asserts.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GameState } from "../../../server/game/game.ts";

export interface ClientGameContextInput {
  readonly gameId: string,
  readonly isAdmin: boolean,
  readonly myPlayerId: number,
  readonly stateType: GameState['type'],
}

export interface ClientGameContext extends ClientGameContextInput {
  readonly resolver: ServiceResolver,
}

export function provideClientGameContext(): ClientGameContext {
  throw new Breaker('client-game-context-must-be-injected');
}
