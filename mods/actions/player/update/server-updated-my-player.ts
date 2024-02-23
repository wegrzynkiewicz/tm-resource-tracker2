import { ServiceResolver } from "../../../common/dependency.ts";
import { GADefinition, GAHandler } from "../../../common/communication/define.ts";
import { Player, PlayerUpdateDTO, providePlayer } from "../common.ts";

export type ServerUpdatedMyPlayerGA = PlayerUpdateDTO;

export const serverUpdatedMyPlayerGADef: GADefinition<ServerUpdatedMyPlayerGA> = {
  kind: 'server-updated-my-player',
};

export class ServerUpdatedMyPlayerGAHandler implements GAHandler<ServerUpdatedMyPlayerGA>{
  public constructor(
    private readonly player: Player,
  ) { }

  public async handle(action: ServerUpdatedMyPlayerGA): Promise<void> {
    const { color, name } = action;
    this.player.color = color
    this.player.name = name;
  }
}

export function provideServerUpdatedMyPlayerGAHandler(resolver: ServiceResolver) {
  return new ServerUpdatedMyPlayerGAHandler(
    resolver.resolve(providePlayer),
  );
}
