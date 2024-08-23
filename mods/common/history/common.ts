import { Resource } from "../../core/resources.ts";
import { Player } from "../player/common.ts";

export interface HistoryCommon {
  historyEntryId: string;
  time: Date;
}

export interface HistorySingleEntry extends HistoryCommon {
  player: Player;
  resource: Resource;
  type: "single";
}

export interface HistorySummaryEntry extends HistoryCommon {
  player: Player;
  resources: Resource[];
  type: "summary";
}

export interface HistoryGenerationEntry extends HistoryCommon {
  count: number;
  type: "generation";
}

export type HistoryEntry = HistorySingleEntry | HistorySummaryEntry | HistoryGenerationEntry;

export const examples: HistoryEntry[] = [
  {
    historyEntryId: "1",
    player: {
      playerId: 1,
      name: "Player 1",
      color: "red",
      isAdmin: true,
    },
    type: "single",
    resource: { count: -22, target: "amount", type: "gold" },
    time: new Date(),
  },
  {
    historyEntryId: "2",
    player: {
      playerId: 2,
      name: "Player 2",
      color: "blue",
      isAdmin: false,
    },
    type: "summary",
    resources: [
      { count: 24, target: "amount", type: "gold" },
      { count: 2, target: "amount", type: "steel" },
      { count: 2, target: "amount", type: "points" },
    ],
    time: new Date(),
  },
  {
    historyEntryId: "4",
    type: "generation",
    count: 14,
    time: new Date(),
  },
  {
    historyEntryId: "3",
    player: {
      playerId: 3,
      name: "Bardzo długie imię gracza, żę jooo i trochę",
      color: "green",
      isAdmin: false,
    },
    type: "single",
    resource: { count: -11, target: "production", type: "titan" },
    time: new Date(),
  },
];
