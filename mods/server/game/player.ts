import { Color } from "../../common/colors.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideTokenManager, Token, TokenManager } from "./token.ts";

export interface Player {
  name: string;
  readonly playerId: number;
  readonly color: Color;
  readonly token: Token;
}

export interface PlayerDTO {
  playerId: number;
  colorKey: string;
  name: string;
}

export let playerIdCounter = 0;

export class PlayerManager {
  public readonly players = new Map<number, Player>();

  public constructor(
    public readonly tokenManager: TokenManager,
    public readonly gameId: string,
  ) { }

  public createPlayer(name: string, color: Color): Player {
    const playerId = ++playerIdCounter;
    const token = this.tokenManager.createToken(playerId, this.gameId);

    const player: Player = {
      name,
      playerId,
      color,
      token,
    };

    this.players.set(playerId, player);
    return player;
  }

  public *fetchPlayers(): Generator<PlayerDTO, void, unknown> {
    for (const player of this.players.values()) {
      const { playerId, color: { key }, name } = player;
      yield {
        playerId,
        colorKey: key,
        name,
      }
    }
  }
}

export class PlayerManagerFactory {
  public constructor(
    public readonly tokenManager: TokenManager,
  ) { }

  public createPlayerManager(gameId: string): PlayerManager {
    return new PlayerManager(
      this.tokenManager,
      gameId,
    );
  }
}

export function providePlayerManagerFactory(resolver: ServiceResolver) {
  return new PlayerManagerFactory(
    resolver.resolve(provideTokenManager),
  );
}
