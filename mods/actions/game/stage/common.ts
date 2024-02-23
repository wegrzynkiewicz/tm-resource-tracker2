import { GADefinition } from "../../../common/communication/define.ts";
import { ServerPlayerContext } from "../../player/server/context.ts";

export interface GameStageGA {
  stage: string;
}

export const gameStageGADef: GADefinition<GameStageGA> = {
  kind: 'game-stage'
};

export interface GameStage {
  kind: string;
  handlePlayerContextCreation: (context: ServerPlayerContext) => void;
  handlePlayerContextDeletion: (context: ServerPlayerContext) => void;
  run: () => void;
}
