import { Channel } from "@framework/dom/channel.ts";
import { serverGameScopeToken } from "../defs.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { Context } from "@framework/dependency/context.ts";

export const playerCreatedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scopeToken: serverGameScopeToken,
});

export const playerDeletedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scopeToken: serverGameScopeToken,
});

export const playerConnectedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scopeToken: serverGameScopeToken,
});

export const playerDisconnectedChannelDependency = defineDependency({
  provider: () => new Channel<[Context, PlayerDTO]>(),
  scopeToken: serverGameScopeToken,
});
