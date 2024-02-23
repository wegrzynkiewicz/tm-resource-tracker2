import { GADefinition } from "../../../common/communication/define.ts";

export interface GameStageGA {
  stage: string;
}

export const gameStageGADef: GADefinition<GameStageGA> = {
  kind: 'game-stage'
};

export type GameStage = "waiting" | "playing";
