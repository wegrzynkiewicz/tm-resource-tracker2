import { ServiceResolver } from "../../../common/dependency.ts";
import { Channel } from "../../../frontend-framework/store.ts";
import { CreateGameEPRequest, CreateGameEPResponse } from "../../../server/features/create-game-ep.ts";
import { ReadGameEPResponse } from "../../../server/features/read-game-ep.ts";
import { AppView, provideAppView } from "../app/app.ts";
import { ClientConfig, provideClientConfig } from "../config.ts";
import { HomepageView, provideHomepageView } from "../homepage/homepage.ts";
import { provideWaitingView } from "../waiting/waiting.ts";
import { ClientGameContext, ClientGameContextInput, provideClientGameContext } from "./client-game.ts";
import { provideCreateGameChannel, provideJoinGameChannel } from "./source.ts";
import { CreateGame, JoinGame } from "./source.ts";

export class ClientGameManager {

  public constructor(
    private appView: AppView,
    private homepageView: HomepageView,
    private config: ClientConfig,
    createGameChannel: Channel<CreateGame>,
    joinGameChannel: Channel<JoinGame>,
  ) {
    createGameChannel.on((input) => this.createGame(input));
    // joinGameChannel.on((input) => this.createGame(input));
  }

  public async bootstrap() {
    const result = await this.loadCurrentGame();
    if (result === null) {
      this.appView.homepage();
    }
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
    const { token } = response;
    sessionStorage.setItem("token", token);
    this.createClientGameContext(response);
  }

  private async loadCurrentGame() {
    const { apiUrl } = this.config;
    const token = sessionStorage.getItem('token');
    if (token === null) {
      return null;
    }
    const envelope = await fetch(`${apiUrl}/games`, {
      method: "GET",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    });
    const data = await envelope.json();
    if (data.error) {
      return null;
    }
    const response = data as ReadGameEPResponse;
    this.createClientGameContext(response);
  }

  public createClientGameContext(input: ClientGameContextInput): ClientGameContext {
    const { stateType } = input;
    const resolver = new ServiceResolver();
    const context: ClientGameContext = {
      ...input,
      resolver,
    }
    resolver.inject(provideClientGameContext, context);
    if (stateType === "waiting") {
      const waitingView = resolver.resolve(provideWaitingView);
      this.appView.mount(waitingView.$root);
      this.appView.hideToolbar();
    }
    return context;
  }
}

export function provideClientGameManager(resolver: ServiceResolver) {
  return new ClientGameManager(
    resolver.resolve(provideAppView),
    resolver.resolve(provideHomepageView),
    resolver.resolve(provideClientConfig),
    resolver.resolve(provideCreateGameChannel),
    resolver.resolve(provideJoinGameChannel),
  );
}
