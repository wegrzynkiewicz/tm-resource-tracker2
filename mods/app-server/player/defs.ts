import { duplexScopeContract } from "@acme/dependency/scopes.ts";
import { Channel } from "@acme/dom/channel.ts";
import { serverGameScopeContract } from "../defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { Context } from "@acme/dependency/context.ts";

export const duplexIdDependency = defineDependency<number>({
  scope: duplexScopeContract,
});

export const playerCreatedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerDeletedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerConnectedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scope: serverGameScopeContract,
});

export const playerDisconnectedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scope: serverGameScopeContract,
});
