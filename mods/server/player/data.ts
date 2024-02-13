import { Breaker, assertObject } from "../../common/asserts.ts";
import { Color, colorByKeys } from "../../common/colors.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideServerGameContext, ServerGameContext } from "../game/game.ts";
import { provideTokenManager, Token, TokenManager } from "../game/token.ts";

export interface Player {
  color: Color;
  readonly isAdmin: boolean;
  name: string;
  readonly playerId: number;
  readonly token: Token;
}

export function providePlayerData(): Player {
  throw new Breaker('player-must-be-injected');
}

export interface PlayerInput {
  readonly colorKey: string;
  readonly name: string;
  readonly isAdmin: boolean;
}

export interface PlayerDTO extends PlayerInput {
  readonly playerId: number;
}

export let playerIdCounter = 0;

export class PlayerDataManager {
  public readonly players = new Map<number, Player>();

  public constructor(
    private readonly gameContext: ServerGameContext,
    private readonly tokenManager: TokenManager,
  ) { }

  public createPlayerData(
    { colorKey, name, isAdmin }: PlayerInput
  ): Player {
    const playerId = ++playerIdCounter;
    const color = colorByKeys.get(colorKey);
    assertObject(color, 'invalid-color-key');

    const { gameId } = this.gameContext.identifier;

    const token = this.tokenManager.createToken({ gameId, playerId });

    const player: Player = {
      color,
      isAdmin,
      name,
      playerId,
      token,
    };

    this.players.set(playerId, player);
    return player;
  }

  public *fetchPlayers(): Generator<PlayerDTO, void, unknown> {
    for (const player of this.players.values()) {
      const { playerId, color: { key }, name, isAdmin } = player;
      yield {
        colorKey: key,
        name,
        isAdmin,
        playerId,
      }
    }
  }
}

export function providePlayerDataManager(resolver: ServiceResolver) {
  return new PlayerDataManager(
    resolver.resolve(provideServerGameContext),
    resolver.resolve(provideTokenManager),
  );
}
