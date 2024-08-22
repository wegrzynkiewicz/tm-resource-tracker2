import { Channel } from "../../../core/channel.ts";
import { PlayerUpdateDTO } from "../../player/common.ts";
import { JoinGame } from "../join/common.ts";

export function provideCreateGameChannel() {
  return new Channel<PlayerUpdateDTO>();
}

export function provideJoinGameChannel() {
  return new Channel<JoinGame>();
}
