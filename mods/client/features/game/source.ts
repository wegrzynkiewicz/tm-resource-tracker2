import { Channel } from "../../../common/channel.ts";

export interface CreateGame {
  colorKey: string;
  name: string;
}

export function provideCreateGameChannel() {
  return new Channel<CreateGame>();
}

export interface JoinGame {
  colorKey: string;
  gameId: string;
  name: string;
}

export function provideJoinGameChannel() {
  return new Channel<JoinGame>();
}
