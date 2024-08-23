import { Channel } from "../../../core/channel.ts";
import { ServiceResolver } from "../../../core/dependency.ts";
import { GameResponse } from "../game.ts";
import { PlayerUpdateDTO } from "../../player/common.ts";
import { ClientConfig, provideClientConfig } from "../../../app-client/src/config.ts";
import { ClientGameContextManager, provideClientGameContextManager } from "./context.ts";
import { provideCreateGameChannel, provideJoinGameChannel } from "./source.ts";
import { JoinGame } from "../join/common.ts";
import { provideQuitGameChannel } from "../quit/modal.ts";
import { provideHomepageView } from "../../../app-client/src/homepage/homepage.ts";
import { GlobalContext, provideGlobalContext } from "../../../core/global.ts";

export class ClientGameManager {

  public constructor(
    private config: ClientConfig,
    private clientGameContextManager: ClientGameContextManager,
    createGameChannel: Channel<PlayerUpdateDTO>,
    private globalContext: GlobalContext,
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
      this.renderHomepage();
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
    this.renderHomepage();
  }

  public async bootstrap() {
    const { apiUrl } = this.config;
    const token = localStorage.getItem('token');
    if (token === null) {
      this.renderHomepage();
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
      this.renderHomepage();
      return;
    }
    const response = data as GameResponse;
    this.clientGameContextManager.createClientGameContext(response);
  }

  private renderHomepage() {
    this.globalContext.resolver.resolve(provideHomepageView).render();
  }
}

export function provideClientGameManager(resolver: ServiceResolver) {
  return new ClientGameManager(
    resolver.resolve(provideClientConfig),
    resolver.resolve(provideClientGameContextManager),
    resolver.resolve(provideCreateGameChannel),
    resolver.resolve(provideGlobalContext),
    resolver.resolve(provideJoinGameChannel),
    resolver.resolve(provideQuitGameChannel),
  );
}
