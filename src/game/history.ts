import { mapToFragment } from "../common.ts";
import { Channel } from "../common/channel.ts";
import { fragment_nodes, div_text, img_props, div_nodes, div, span_text } from "../common/dom.ts";

export type SupplyType = "points" | "gold" | "steel" | "titan" | "plant" | "energy" | "heat";
export type SupplyTarget = "production" | "amount";

export interface HistorySupply {
  count: number;
  target: SupplyTarget;
  type: SupplyType;
}

export interface Player {
  playerId: string;
  name: string;
  color: string;
}

export interface HistoryCommon {
  player: Player | null;
  historyEntryId: string;
  time: Date,
}

export interface HistorySingleEntry extends HistoryCommon {
  supply: HistorySupply,
  type: "single";
}

export interface HistorySummaryEntry extends HistoryCommon {
  supplies: HistorySupply[],
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
      playerId: "1",
      name: "Player 1",
      color: "red",
    },
    type: "single",
    supply: { count: -22, target: "amount", type: "gold" },
    time: new Date(),
  },
  {
    historyEntryId: "2",
    player: {
      playerId: "2",
      name: "Player 2",
      color: "blue",
    },
    type: "summary",
    supplies: [
      { count: 24, target: "amount", type: "gold" },
      { count: 2, target: "amount", type: "steel" },
    ],
    time: new Date(),
  },
  {
    historyEntryId: "3",
    player: {
      playerId: "3",
      name: "Player 3",
      color: "green",
    },
    type: "single",
    supply: { count: 1, target: "amount", type: "titan" },
    time: new Date(),
  },
];

export const historyEntryCreatedChannel = new Channel<HistoryEntry>();

export function createHistorySingleEntry(entry: HistorySingleEntry) {
  const { player, supply } = entry;
  const { count, target, type } = supply;

  return div_nodes("history --single", [
    span_props({ className: "player-cube", style: `--background: var(--color-player-cube-${player.color})` }),
    span_text("history__item", player.name),
  ]);
}

export function createHistoryEntry(entry: HistoryEntry) {
  switch (entry.type) {
    case "single":
      return createHistorySingleEntry(entry);
    // case "summary":
    //   return createHistorySummaryEntry(entry);
    // case "generation":
    //   return createHistoryGenerationEntry(entry);
  }
}

export function canPaintHistoryEntry(entry: HistoryEntry, panelPlayerId: string | null) {
  if (panelPlayerId === null) {
    return true;
  }
  if (entry.player.playerId === panelPlayerId) {
    return true;
  }
  if (entry.player.playerId === null) {
    return true;
  }
  return false;
}

export function createHistories(panelPlayerId: string | null) {
  const container = div("history");

  historyEntryCreatedChannel.subscribers.add((entry) => {
    if (canPaintHistoryEntry(entry, panelPlayerId)) {
      const element = createHistoryEntry(entry);
      container.appendChild(element);
    }
  });

  return div_nodes("panel__item", [container]);
}

export function createHistoriesPanel() {
  return div_nodes("panel", [
    mapToFragment(["1"], createHistories),
  ]);
}

function span_props(arg0: { className: string; style: string; }): Node {
  throw new Error("Function not implemented.");
}
