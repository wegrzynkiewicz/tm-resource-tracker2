import { Channel } from "../common/channel.ts";
import { div_nodes, div_text, div_props, div_empty } from "../common/dom.ts";
import { createResource } from "./resource.ts";
import { Resource } from "./resource.ts";
import { createPanel } from "./panel.ts";

export interface Player {
  playerId: string;
  name: string;
  color: string;
}

export interface HistoryCommon {
  historyEntryId: string;
  time: Date,
}

export interface HistorySingleEntry extends HistoryCommon {
  player: Player;
  resource: Resource,
  type: "single";
}

export interface HistorySummaryEntry extends HistoryCommon {
  player: Player;
  resources: Resource[],
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
    resource: { count: -22, target: "amount", type: "gold" },
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
      playerId: "3",
      name: "Bardzo długie imię gracza, żę jooo i trochę",
      color: "green",
    },
    type: "single",
    resource: { count: -11, target: "production", type: "titan" },
    time: new Date(),
  },
];

export const historyEntryCreatedChannel = new Channel<HistoryEntry>();

export function formatDate(date: Date) {
  return date.toISOString().substring(11, 19);
}

export function createHistoryHeader({ player, time, slot, }: {
  player: Player;
  time: Date;
  slot: Node;
}) {
  return div_nodes("history__header", [
    div_props({ className: "player-cube", style: `--background: var(--color-player-cube-${player.color})` }),
    div_text("history__name", player.name),
    slot,
    div_text("history__time", formatDate(time)),
  ]);
}

export function createHistorySingleEntry(entry: HistorySingleEntry) {
  const { player, resource, time } = entry;
  return div_nodes("history --background", [
    div_nodes("history__header", [
      div_props({ className: "player-cube", style: `--background: var(--color-player-cube-${player.color})` }),
      div_text("history__name", player.name),
      createResource(resource),
      div_text("history__time", formatDate(time)),
    ]),
  ]);
}

export function createHistorySummaryEntry(entry: HistorySummaryEntry) {
  const { player, resources, time } = entry;
  return div_nodes("history --background", [
    div_nodes("history__header", [
      div_props({ className: "player-cube", style: `--background: var(--color-player-cube-${player.color})` }),
      div_text("history__name", player.name),
      div_text("history__time", formatDate(time)),
    ]),
    div_nodes("history__body", resources.map(createResource)),
  ]);
}

export function createHistoryGenerationEntry(entry: HistoryGenerationEntry) {
  const { count } = entry;
  return div_nodes("history", [
    div_text("history__generation", count.toString()),
  ]);
}

export function createHistoryEntry(entry: HistoryEntry) {
  switch (entry.type) {
    case "single":
      return createHistorySingleEntry(entry);
    case "summary":
      return createHistorySummaryEntry(entry);
    case "generation":
      return createHistoryGenerationEntry(entry);
  }
}

export function canPaintPlayerHistoryEntry(entry: HistoryEntry, panelPlayerId: string | null) {
  if (panelPlayerId === null) {
    return true;
  }
  if (entry.type === "generation") {
    return true;
  }
  if (entry.player.playerId === panelPlayerId) {
    return true;
  }
  return false;
}

export function createPlayerHistory(panelPlayerId: string | null) {
  const container = div_empty("histories");
  historyEntryCreatedChannel.subscribers.add((entry) => {
    if (canPaintPlayerHistoryEntry(entry, panelPlayerId)) {
      const element = createHistoryEntry(entry);
      container.appendChild(element);
    }
  });
  return container;
}

export function createHistoriesPanel() {
  return createPanel([
    createPlayerHistory(null),
    ...["1"].map(createPlayerHistory),
  ]);
}
