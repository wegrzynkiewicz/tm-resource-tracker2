import { assertObject } from "../../common/asserts.ts";
import { colorByKeys } from "../../common/colors.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideServerGameContext, ServerGameContext } from "../game/game.ts";
import { provideTokenManager, TokenManager } from "../game/token.ts";
import { Player, PlayerInput, PlayerDTO } from "../../player/data.ts";

export let playerIdCounter = 0;

export class ServerPlayerDataManager {
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

export function provideServerPlayerDataManager(resolver: ServiceResolver) {
  return new ServerPlayerDataManager(
    resolver.resolve(provideServerGameContext),
    resolver.resolve(provideTokenManager),
  );
}
