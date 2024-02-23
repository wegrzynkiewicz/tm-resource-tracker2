import { ServiceResolver } from "../../../common/dependency.ts";
import { GAProcessor } from "../../../common/communication/processor.ts";
import { provideGameStageGAHandler } from "../stage/game-stage-ga.ts";
import { gameStageGADef } from "../stage/common.ts";
import { provideWaitingPlayersGAHandler } from "../../player/waiting/action-handler.ts";
import { waitingPlayersGADef } from "../../player/waiting/common.ts";
import { provideServerUpdatedMyPlayerGAHandler } from "../../player/update/server-updated-my-player.ts";
import { serverUpdatedMyPlayerGADef } from "../../player/update/server-updated-my-player.ts";
import { provideServerPlayingGameGAHandler } from "../../playing/server-playing-action-handler.ts";
import { playingGameGADef } from "../../playing/common.ts";

export function feedClientGAProcessor(resolver: ServiceResolver, gaProcessor: GAProcessor) {
  const handlers = gaProcessor.handlers;
  handlers.set(gameStageGADef.kind, resolver.resolve(provideGameStageGAHandler));
  handlers.set(waitingPlayersGADef.kind, resolver.resolve(provideWaitingPlayersGAHandler));
  handlers.set(serverUpdatedMyPlayerGADef.kind, resolver.resolve(provideServerUpdatedMyPlayerGAHandler));
  handlers.set(playingGameGADef.kind, resolver.resolve(provideServerPlayingGameGAHandler));
}
