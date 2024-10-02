import { Channel } from "@acme/dependency/channel.ts";
import { serverGameScopeContract } from "../defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { ServerPlayerContext } from "./player-context.ts";
import { ServerPlayerDuplexContext } from "./player-duplex-context.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";

export const playerCreatedChannelDependency = defineDependency({
  name: "player-created-channel",
  provider: () => new Channel<[ServerPlayerContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerDeletedChannelDependency = defineDependency({
  name: "player-deleted-channel",
  provider: () => new Channel<[ServerPlayerContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerConnectedChannelDependency = defineDependency({
  name: "player-connected-channel",
  provider: () => new Channel<[ServerPlayerDuplexContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerDisconnectedChannelDependency = defineDependency({
  name: "player-disconnected-channel",
  provider: () => new Channel<[ServerPlayerDuplexContext, PlayerDTO]>(),
  scope: serverGameScopeContract,
});
