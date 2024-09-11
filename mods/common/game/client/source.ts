import { defineDependency } from "@acme/dependency/injection.ts";
import { JoinGame } from "../join/common.ts";
import { Channel } from "@acme/dependency/channel.ts";
import { MyPlayerDTO } from "../../player/common.ts";

export function provideCreateGameChannel() {
  return new Channel<[MyPlayerDTO]>();
}
export const createGameChannelDependency = defineDependency({
  kind: "create-game-channel",
  provider: provideCreateGameChannel,
});

export function provideJoinGameChannel() {
  return new Channel<[JoinGame]>();
}
export const joinGameChannelDependency = defineDependency({
  kind: "join-game-channel",
  provider: provideJoinGameChannel,
});
