import { ClientConfig, clientConfigDependency } from "../../../app-client/src/config.ts";
import { Channel } from "../../../core/channel.ts";
import { defineDependency, DependencyResolver, Scope, scopeDependency } from "@acme/dependency/declaration.ts";
import { MyPlayerDTO } from "../../player/player.layout.ts";
import { Game } from "../game-create.ts";
import { JoinGame } from "../join/common.ts";
import { quitGameChannelDependency } from "../quit/modal.ts";
import { ClientGameContextManager, clientGameContextManagerDependency } from "./context.ts";
import { createGameChannelDependency, joinGameChannelDependency } from "./source.ts";
import { homepageViewDependency, HomeView } from "../../../app-client/src/frontend/home/home-view.ts";

export class ClientGameManager {
  public constructor(
    private config: ClientConfig,
    private clientGameContextManager: ClientGameContextManager,
    createGameChannel: Channel<MyPlayerDTO>,
    private homepageView: HomeView,
    joinGameChannel: Channel<JoinGame>,
    quitGameChannel: Channel<null>,
  ) {
    createGameChannel.on((input) => this.createGame(input));
    joinGameChannel.on((input) => this.joinGame(input));
    quitGameChannel.on(() => this.quitGame());
  }

  private async createGame(request: MyPlayerDTO) {
    const { apiUrl } = this.config;
    const envelope = await fetch(`${apiUrl}/games/create`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
      },
      body: JSON.stringify(request),
    });
    const data = await envelope.text();
    console.log(data);
    const response = data as Game;
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
    const token = localStorage.getItem("token");
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
    localStorage.removeItem("token");
    this.renderHomepage();
  }

  public async bootstrap() {
    const { apiUrl } = this.config;
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      this.renderHomepage();
      return;
    }
    const response = data as Game;
    this.clientGameContextManager.createClientGameContext(response);
  }

  private renderHomepage() {
    this.homepageView.render();
  }
}

export function provideClientGameManager(resolver: DependencyResolver) {
  return new ClientGameManager(
    resolver.resolve(clientConfigDependency),
    resolver.resolve(clientGameContextManagerDependency),
    resolver.resolve(createGameChannelDependency),
    resolver.resolve(homepageViewDependency),
    resolver.resolve(joinGameChannelDependency),
    resolver.resolve(quitGameChannelDependency),
  );
}
export const clientGameManagerDependency = defineDependency({
  provider: provideClientGameManager,
});
