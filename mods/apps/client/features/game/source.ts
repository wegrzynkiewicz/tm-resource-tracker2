import { Channel } from "../../../../common/channel.ts";
import { JoinGame } from "../../../../domain/game.ts";
import { PlayerUpdateDTO } from "../../../../domain/player.ts";

export function provideCreateGameChannel() {
  return new Channel<PlayerUpdateDTO>();
}

export function provideJoinGameChannel() {
  return new Channel<JoinGame>();
}
