import { defineDependency } from "@acme/dependency/declaration.ts";
import { JoinGame } from "../join/common.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { MyPlayerDTO } from "../../player/player.layout.ts";

export function provideCreateGameChannel() {
  return new Channel<[MyPlayerDTO]>();
}
export const createGameChannelDependency = defineDependency({
  name: "create-game-channel",
  provider: provideCreateGameChannel,
});

export function provideJoinGameChannel() {
  return new Channel<[JoinGame]>();
}
export const joinGameChannelDependency = defineDependency({
  name: "join-game-channel",
  provider: provideJoinGameChannel,
});
