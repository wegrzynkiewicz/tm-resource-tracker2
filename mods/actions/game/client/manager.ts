import { Channel } from "../../../common/channel.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GameResponse } from "../game.ts";
import { PlayerUpdateDTO } from "../../player/common.ts";
import { AppView, provideAppView } from "../../../apps/client/features/app/app.ts";
import { ClientConfig, provideClientConfig } from "../../../apps/client/features/config.ts";
import { provideQuitGameChannel } from "../quit/modal.ts";
import { ClientGameContextManager, provideClientGameContextManager } from "./context.ts";
import { provideCreateGameChannel, provideJoinGameChannel } from "./source.ts";
import { JoinGame } from "../join/common.ts";

export class ClientGameManager {

  public constructor(
    private appView: AppView,
    private config: ClientConfig,
    private clientGameContextManager: ClientGameContextManager,
    createGameChannel: Channel<PlayerUpdateDTO>,
    joinGameChannel: Channel<JoinGame>,
    quitGameChannel: Channel<null>,
  ) {
    createGameChannel.on((input) => this.createGame(input));
    joinGameChannel.on((input) => this.joinGame(input));
    quitGameChannel.on(() => this.quitGame());
  }

  private async createGame(request: PlayerUpdateDTO) {
    const { apiUrl } = this.config;
    const envelope = await fetch(`${apiUrl}/games/create`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
      },
      body: JSON.stringify(request),
    });
    const data = await envelope.json();
    const response = data as GameResponse;
    localStorage.setItem("token", response.token);
    this.clientGameContextManager.createClientGameContext(response);
  }

  private async joinGame(request: JoinGame) {
    const { apiUrl } = this.config;
    const envelope = await fetch(`${apiUrl}/games/join`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
      },
      body: JSON.stringify(request),
    });
    const data = await envelope.json();
    const response = data as GameResponse;
    localStorage.setItem("token", response.token);
    this.clientGameContextManager.createClientGameContext(response);
  }

  private async quitGame() {
    this.clientGameContextManager.deleteClientGameContext();
    const token = localStorage.getItem('token');
    if (token === null) {
      this.appView.homepage();
      return;
    }
    const { apiUrl } = this.config;
    await fetch(`${apiUrl}/games/quit`, {
      method: "POST",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
    localStorage.removeItem('token');
    this.appView.homepage();
  }

  public async bootstrap() {
    const { apiUrl } = this.config;
    const token = localStorage.getItem('token');
    if (token === null) {
      this.appView.homepage();
      return;
    }
    const envelope = await fetch(`${apiUrl}/games/read`, {
      method: "GET",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
    const data = await envelope.json();
    if (data.error) {
      localStorage.removeItem('token');
      this.appView.homepage();
      return;
    }
    const response = data as GameResponse;
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
    resolver.resolve(provideQuitGameChannel),
  );
}
