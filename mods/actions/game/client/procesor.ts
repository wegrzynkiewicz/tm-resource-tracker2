import { ServiceResolver } from "../../../common/dependency.ts";
import { GAProcessor } from "../../../common/communication/processor.ts";
import { provideWaitingPlayersGAHandler } from "../../player/waiting/waiting-players-action-handler.ts";
import { waitingPlayersGADef } from "../../player/waiting/common.ts";
import { provideServerUpdatedMyPlayerGAHandler } from "../../player/update/server-updated-my-player.ts";
import { serverUpdatedMyPlayerGADef } from "../../player/update/server-updated-my-player.ts";
import { provideServerPlayingGameGAHandler } from "../../playing/server-playing-action-handler.ts";
import { playingGameGADef } from "../../playing/common.ts";
import { provideWaitingGameStageGAHandler } from "../../player/waiting/waiting-game-stage-action-handler.ts";
import { waitingGameStageGADef } from "../../player/waiting/common.ts";

export function feedClientGAProcessor(resolver: ServiceResolver, gaProcessor: GAProcessor) {
  const handlers = gaProcessor.handlers;
  handlers.set(waitingGameStageGADef.kind, resolver.resolve(provideWaitingGameStageGAHandler));
  handlers.set(waitingPlayersGADef.kind, resolver.resolve(provideWaitingPlayersGAHandler));
  handlers.set(serverUpdatedMyPlayerGADef.kind, resolver.resolve(provideServerUpdatedMyPlayerGAHandler));
  handlers.set(playingGameGADef.kind, resolver.resolve(provideServerPlayingGameGAHandler));
}
