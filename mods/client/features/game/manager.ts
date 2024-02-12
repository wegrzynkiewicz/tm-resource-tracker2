import { ServiceResolver } from "../../../common/dependency.ts";
import { CreateGameEPRequest, CreateGameEPResponse } from "../../../server/features/create-game-ep.ts";
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

  public async createGame(request: CreateGameEPRequest) {
    const { apiUrl } = this.config;
    const envelope = await fetch(`${apiUrl}/games`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
      },
      body: JSON.stringify(request),
    });
    const data = await envelope.json();
    const response = data as CreateGameEPResponse;
    const { gameId, myPlayerId, stateType, token } = response;
    sessionStorage.setItem("token", token);
    this.createClientGameContext(gameId, myPlayerId);
    appState.emit(stateType);
  }

  protected async currentGame() {
    const { apiUrl } = this.config;
    const token = sessionStorage.getItem('token');
    if (token === null) {
      return false;
    }
    const envelope = await fetch(`${apiUrl}/games`, {
      method: "GET",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
    const data = await envelope.json();
    if (data.error) {
      return false;
    }
    const response = data as ReadGameEPResponse;
    const { gameId, myPlayerId, stateType } = response;
    this.createClientGameContext(gameId, myPlayerId);
    appState.emit(stateType);
  }

  public createClientGameContext(gameId: string, myPlayerId: number): ClientGameContext {
    const resolver = new ServiceResolver();
    const context: ClientGameContext = {
      gameId,
      myPlayerId,
      resolver,
    }
    return context;
  }
}

export function provideClientGameManager(resolver: ServiceResolver) {
  return new ClientGameManager(
    resolver.resolve(provideClientConfig),
  );
}
