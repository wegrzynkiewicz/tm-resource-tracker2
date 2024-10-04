import { Channel } from "@acme/dom/channel.ts";
import { serverGameScopeContract } from "../defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { ServerPlayerContext } from "./player-context.ts";
import { ServerPlayerDuplexContext } from "./player-duplex-context.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";

export const playerCreatedChannelDependency = defineDependency({
  provider: () => new Channel<[ServerPlayerContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerDeletedChannelDependency = defineDependency({
  provider: () => new Channel<[ServerPlayerContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerConnectedChannelDependency = defineDependency({
  provider: () => new Channel<[ServerPlayerDuplexContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerDisconnectedChannelDependency = defineDependency({
  provider: () => new Channel<[ServerPlayerDuplexContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});
