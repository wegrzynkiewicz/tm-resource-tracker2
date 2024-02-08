import { ServiceResolver } from "../../common/dependency.ts";
import { cryptoRandomString } from "../../deps.ts";
import { PlayerManager, PlayerManagerFactory, providePlayerManagerFactory } from "./player.ts";

export class Game {
  public constructor(
    public readonly gameId: string,
    public readonly playerManager: PlayerManager,
  ) { }
}

export class GameManager {
  public readonly games = new Map<string, Game>();

  public constructor(
    public readonly playerManagerFactory: PlayerManagerFactory,
  ) { }

  private generateGameId(): string {
    while (true) {
      const gameId = cryptoRandomString({ length: 5, type: 'distinguishable' });
      if (this.games.has(gameId)) {
        continue;
      }
      return gameId;
    }
  }

  public async createGame(): Promise<Game> {
    const gameId = this.generateGameId();
    const playerManager = this.playerManagerFactory.createPlayerManager(gameId);
    const game = new Game(gameId, playerManager);
    this.games.set(gameId, game);
    return game;
  }
}

export function provideGameManager(resolver: ServiceResolver) {
  return new GameManager(
    resolver.resolve(providePlayerManagerFactory),
  );
}
