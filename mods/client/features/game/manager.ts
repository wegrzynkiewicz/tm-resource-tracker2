import { ServiceResolver } from "../../../common/dependency.ts";
import { Channel } from "../../../frontend-framework/store.ts";
import { CreateGameEPRequest, CreateGameEPResponse } from "../../../server/features/create-game-ep.ts";
import { ReadGameEPResponse } from "../../../server/features/read-game-ep.ts";
import { AppView, provideAppView } from "../app/app.ts";
import { ClientConfig, provideClientConfig } from "../config.ts";
import { ClientGameContextManager, provideClientGameContextManager } from "./context.ts";
import { provideCreateGameChannel, provideJoinGameChannel } from "./source.ts";
import { CreateGame, JoinGame } from "./source.ts";

export class ClientGameManager {

  public constructor(
    private appView: AppView,
    private config: ClientConfig,
    private clientGameContextManager: ClientGameContextManager,
    createGameChannel: Channel<CreateGame>,
    joinGameChannel: Channel<JoinGame>,
  ) {
    createGameChannel.on((input) => this.createGame(input));
    // joinGameChannel.on((input) => this.createGame(input));
  }

  private async createGame(request: CreateGameEPRequest) {
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
    sessionStorage.setItem("token", response.token);
    this.clientGameContextManager.createClientGameContext(response);
  }

  public async bootstrap() {
    const { apiUrl } = this.config;
    const token = sessionStorage.getItem('token');
    if (token === null) {
      this.appView.homepage();
      return;
    }
    const envelope = await fetch(`${apiUrl}/games`, {
      method: "GET",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
    const data = await envelope.json();
    if (data.error) {
      sessionStorage.removeItem('token');
      this.appView.homepage();
      return;
    }
    const response = data as ReadGameEPResponse;
    this.clientGameContextManager.createClientGameContext(response);
  }
}

export function provideClientGameManager(resolver: ServiceResolver) {
  return new ClientGameManager(
    resolver.resolve(provideAppView),
    resolver.resolve(provideClientConfig),
    resolver.resolve(provideClientGameContextManager),
    resolver.resolve(provideCreateGameChannel),
    resolver.resolve(provideJoinGameChannel),
  );
}
