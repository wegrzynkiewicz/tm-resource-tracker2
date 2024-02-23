import { assertTrue } from "../../../common/asserts.ts";
import { GAHandler } from "../../../common/communication/define.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { Player, providePlayer } from "../../player/common.ts";
import { StartGameGA } from "./common.ts";

export class StartGameGAHandler implements GAHandler<StartGameGA>{
  public constructor(
    private readonly player: Player,
  ) { }

  public async handle(): Promise<void> {
    assertTrue(this.player.isAdmin, "player-must-be-admin-to-start-game");
  }
}

export function provideStartGameGAHandler(resolver: ServiceResolver) {
  return new StartGameGAHandler(
    resolver.resolve(providePlayer),
  );
}
