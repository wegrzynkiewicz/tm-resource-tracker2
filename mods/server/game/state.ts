import { createResourceGroup } from "../../common/resources.ts";

export class PlayerState {
  public readonly resources = createResourceGroup(20);
  public readonly buildings = new Map<string, number>();
}

export class GameState {
  public readonly players = new Map<string, PlayerState>();
}

export class HistoryState {
  public readonly entries: 
}
