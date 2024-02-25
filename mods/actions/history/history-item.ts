import { createResource } from "../../apps/client/features/resource.ts";
import { Channel } from "../../common/channel.ts";
import { div_nodes, div_empty, div_text } from "../../common/frontend-framework/dom.ts";
import { HistoryEntry, HistorySingleEntry, HistorySummaryEntry, HistoryGenerationEntry } from "./common.ts";
import { Player } from "../player/common.ts";

export const historyEntryCreatedChannel = new Channel<HistoryEntry>();

export function formatDate(date: Date) {
  return date.toISOString().substring(11, 19);
}

export function createHistoryHeader({ player, time, slot }: {
  player: Player;
  time: Date;
  slot: Node;
}) {
  return div_nodes("history_header", [
    div_empty(`player-cube _${player.color}`),
    div_text("history_name", player.name),
    slot,
    div_text("history_time", formatDate(time)),
  ]);
}

export function createHistorySingleEntry(entry: HistorySingleEntry) {
  const { player, resource, time } = entry;
  return div_nodes("history _background", [
    div_nodes("history_header", [
      div_empty(`player-cube _${player.color}`),
      div_text("history_name", player.name),
      createResource(resource),
      div_text("history_time", formatDate(time)),
    ]),
  ]);
}

export function createHistorySummaryEntry(entry: HistorySummaryEntry) {
  const { player, resources, time } = entry;
  return div_nodes("history _background", [
    div_nodes("history_header", [
      div_empty(`player-cube _${player.color}`),
      div_text("history_name", player.name),
      div_text("history_time", formatDate(time)),
    ]),
    div_nodes("history_body", resources.map(createResource)),
  ]);
}

export function createHistoryGenerationEntry(entry: HistoryGenerationEntry) {
  const { count } = entry;
  return div_nodes("history", [
    div_text("history_generation", count.toString()),
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
  historyEntryCreatedChannel.on((entry) => {
    if (canPaintPlayerHistoryEntry(entry, panelPlayerId)) {
      const element = createHistoryEntry(entry);
      container.appendChild(element);
    }
  });
  return container;
}

export class HistoryItemView {
  public readonly $root: HTMLDivElement;
  public constructor() {
    this.$root = createPlayerHistory(null);
  }
}
