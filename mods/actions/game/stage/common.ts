import { ServerPlayerContext } from "../../player/server/context.ts";

export interface GameStage {
  kind: string;
  handlePlayerContextCreation: (context: ServerPlayerContext) => void;
  handlePlayerContextDeletion: (context: ServerPlayerContext) => void;
  run: () => void;
}
