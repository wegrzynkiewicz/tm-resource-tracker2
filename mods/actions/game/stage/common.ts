import { GADefinition } from "../../../common/communication/define.ts";

export interface GameStageGA {
  stage: string;
}

export const gameStageGADef: GADefinition<GameStageGA> = {
  kind: 'game-stage'
};

export interface WaitingGameStage {
  kind: 'waiting';
}

export interface PlayingGameStage {
  kind: 'playing';
}

export type GameStage = WaitingGameStage | PlayingGameStage;
