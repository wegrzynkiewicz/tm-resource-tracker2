import { ServiceResolver } from "../../../common/dependency.ts";
import { CreateGameEPRequest } from "../../../server/features/create-game-ep.ts";
import { ReadGameEPResponse } from "../../../server/features/read-game-ep.ts";
import { appState } from "../app/app.ts";
import { ClientConfig, provideClientConfig } from "../config.ts";
import { ClientGameContext } from "./client-game.ts";

export class ClientGameManager {

  public constructor(
    private config: ClientConfig,
  ) { }

  public async bootstrap() {
    const isCurrentGame = await this.currentGame()
    if (isCurrentGame === false) {
      appState.emit('homepage');
    }
  }

  public async createGame(payload: CreateGameEPRequest) {
    const { apiUrl } = this.config;
    const response = await fetch(`${apiUrl}/games`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    const { gameId, token } = data;
    sessionStorage.setItem("token", token);
  }

  protected async currentGame() {
    const { apiUrl } = this.config;
    const token = sessionStorage.getItem('token');
    if (token === null) {
      return false;
    }
    const response = await fetch(`${apiUrl}/games`, {
      method: "GET",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      return false;
    }
    const payload = data as ReadGameEPResponse;
    const { gameId, myPlayerId, players } = payload;
    const context = this.createClientGameContext(gameId, myPlayerId);
  }

  public createClientGameContext(gameId: string, myPlayerId: number): ClientGameContext {
    const resolver = new ServiceResolver();
    const context: ClientGameContext = {
      gameId,
      resolver,
      myPlayerId,
    }
    return context;
  }
}

export function provideClientGameManager(resolver: ServiceResolver) {
  return new ClientGameManager(
    resolver.resolve(provideClientConfig),
  );
}
