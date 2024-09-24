import { createResource } from "../../app-client/src/resource.ts";
import { Channel } from "../../core/channel.ts";

import { HistoryEntry, HistoryGenerationEntry, HistorySingleEntry, HistorySummaryEntry } from "./common.ts";
import { Player } from "../player/player.layout.ts";
import { formatTime } from "../../core/formatTime.ts";

export const historyEntryCreatedChannel = new Channel<HistoryEntry>();

export function createHistoryHeader({ player, time, slot }: {
  player: Player;
  time: Date;
  slot: Node;
}) {
  return div_nodes("history_header", [
    div(`player-cube _${player.color}`),
    div("history_name", player.name),
    slot,
    div("history_time", formatTime(time)),
  ]);
}

export function createHistorySingleEntry(entry: HistorySingleEntry) {
  const { player, resource, time } = entry;
  return div_nodes("history _background", [
    div_nodes("history_header", [
      div(`player-cube _${player.color}`),
      div("history_name", player.name),
      createResource(resource),
      div("history_time", formatTime(time)),
    ]),
  ]);
}

export function createHistorySummaryEntry(entry: HistorySummaryEntry) {
  const { player, resources, time } = entry;
  return div_nodes("history _background", [
    div_nodes("history_header", [
      div(`player-cube _${player.color}`),
      div("history_name", player.name),
      div("history_time", formatTime(time)),
    ]),
    div_nodes("history_body", resources.map(createResource)),
  ]);
}

export function createHistoryGenerationEntry(entry: HistoryGenerationEntry) {
  const { count } = entry;
  return div_nodes("history", [
    div("history_generation", count.toString()),
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

export function provideHistoryChannel() {
  return new Channel<HistoryEntry>();
}

export interface HistoryShowStrategy {
  canAppend(entry: HistoryEntry): boolean;
}

export class HistoryShowAll implements HistoryShowStrategy {
  public canAppend() {
    return true;
  }
}

export class HistoryShowPlayer implements HistoryShowStrategy {
  public constructor(
    private readonly playerId: number,
  ) {}

  public canAppend(entry: HistoryEntry) {
    if (entry.type === "generation") {
      return true;
    }
    if (entry.player.playerId === this.playerId) {
      return true;
    }
    return false;
  }
}

export class HistoryItemView {
  public readonly $root = div("histories");
  public constructor(
    private readonly histories: Channel<HistoryEntry>,
    private readonly strategy: HistoryShowStrategy,
  ) {
    histories.on((entry) => {
      if (strategy.canAppend(entry)) {
        const element = createHistoryEntry(entry);
        this.$root.appendChild(element);
      }
    });
  }
}
