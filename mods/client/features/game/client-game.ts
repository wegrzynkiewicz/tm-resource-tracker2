import { ServiceResolver } from "../../../common/dependency.ts";

export interface ClientGameContext {
  readonly gameId: string,
  readonly myPlayerId: number,
  readonly resolver: ServiceResolver,
}
