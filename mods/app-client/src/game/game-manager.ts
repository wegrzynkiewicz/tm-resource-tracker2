import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { jsonRequest } from "@acme/useful/json-request.ts";
import { clientGameScopeContract, frontendScopeContract } from "../../bootstrap.ts";
import { myPlayerDependency } from "../player/my-player.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { Scope } from "@acme/dependency/scopes.ts";
import { Panic } from "@acme/useful/errors.ts";
import { apiURLDependency } from "../api-url-config.ts";
import { gameCreatePathname, gameReadPathname } from "../../../common/game/defs.ts";
import { GameDTO } from "../../../common/game/game-dto.layout.compiled.ts";
import { MyPlayerUpdate } from "../../../common/player/player.layout.compiled.ts";

export interface ClientGame {
  gameId: string;
  scope: Scope;
}

export const clientGameDependency = defineDependency<ClientGame>({
  name: "client-game",
  scope: clientGameScopeContract,
});

export const clientGameTokenDependency = defineDependency<string>({
  name: "client-game-token",
  scope: clientGameScopeContract,
});

export class ClientGameManager {
  public game: ClientGame | null = null;

  public constructor(
    private readonly apiURL: URL,
    private readonly resolver: DependencyResolver,
  ) {}

  private async createScope(payload: GameDTO) {
    const { gameId, token, player } = payload;
    const scope = new Scope(clientGameScopeContract);
    const resolver = new DependencyResolver([...this.resolver.scopes, scope]);

    localStorage.setItem("token", token);

    resolver.inject(clientGameTokenDependency, token);
    resolver.inject(myPlayerDependency, player);

    const clientGame: ClientGame = { gameId, scope };
    resolver.inject(clientGameDependency, clientGame);

    this.game = clientGame;
    return clientGame;
  }

  public async createClientGame(data: MyPlayerUpdate): Promise<ClientGame> {
    const url = new URL(gameCreatePathname, this.apiURL);
    const request = jsonRequest(url, data, { method: "POST" });
    const response = await fetch(request);
    const payload = await response.json() as GameDTO;
    return this.createScope(payload);
  }

  public async restoreClientGame(): Promise<ClientGame | undefined> {
    if (this.game) {
      return this.game;
    }
    const token = localStorage.getItem("token");
    if (token === null) {
      return undefined;
    }
    const url = new URL(gameReadPathname, this.apiURL);
    const request = jsonRequest(url);
    request.headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(request);
    try {
      const payload = await this.apiRequestMaker.processJSONResponse(gameReadResponseContract, response);
      return this.createScope(payload);
    } catch (error) {
      localStorage.removeItem("token");
      throw new Panic("failed-to-restore-game", { error });
    }
  }
}

export function provideClientGameManager(resolver: DependencyResolver) {
  return new ClientGameManager(
    resolver.resolve(apiURLDependency),
    resolver,
  );
}

export const clientGameManagerDependency = defineDependency({
  name: "client-game-manager",
  provider: provideClientGameManager,
  scope: frontendScopeContract,
});

// export class ClientGameManager {
//   public constructor(
//     private config: ClientConfig,
//     private clientGameContextManager: ClientGameContextManager,
//     createGameChannel: Channel<MyPlayerDTO>,
//     private homepageView: HomeView,
//     joinGameChannel: Channel<JoinGame>,
//     quitGameChannel: Channel<null>,
//   ) {
//     createGameChannel.on((input) => this.createGame(input));
//     joinGameChannel.on((input) => this.joinGame(input));
//     quitGameChannel.on(() => this.quitGame());
//   }

//   private async createGame(request: MyPlayerDTO) {
//     const { apiUrl } = this.config;
//     const envelope = await fetch(`${apiUrl}/games/create`, {
//       method: "POST",
//       headers: {
//         ["Content-Type"]: "application/json",
//       },
//       body: JSON.stringify(request),
//     });
//     const data = await envelope.text();
//     console.log(data);
//     const response = data as Game;
//     localStorage.setItem("token", response.token);
//     this.clientGameContextManager.createClientGameContext(response);
//   }

//   private async joinGame(request: JoinGame) {
//     const { apiUrl } = this.config;
//     const envelope = await fetch(`${apiUrl}/games/join`, {
//       method: "POST",
//       headers: {
//         ["Content-Type"]: "application/json",
//       },
//       body: JSON.stringify(request),
//     });
//     const data = await envelope.json();
//     const response = data as GameResponse;
//     localStorage.setItem("token", response.token);
//     this.clientGameContextManager.createClientGameContext(response);
//   }

//   private async quitGame() {
//     this.clientGameContextManager.deleteClientGameContext();
//     const token = localStorage.getItem("token");
//     if (token === null) {
//       this.renderHomepage();
//       return;
//     }
//     const { apiUrl } = this.config;
//     await fetch(`${apiUrl}/games/quit`, {
//       method: "POST",
//       headers: {
//         ["Authorization"]: `Bearer ${token}`,
//       },
//     });
//     localStorage.removeItem("token");
//     this.renderHomepage();
//   }

//   public async bootstrap() {
//     const { apiUrl } = this.config;
//     const token = localStorage.getItem("token");
//     if (token === null) {
//       this.renderHomepage();
//       return;
//     }
//     const envelope = await fetch(`${apiUrl}/games/read`, {
//       method: "GET",
//       headers: {
//         ["Authorization"]: `Bearer ${token}`,
//       },
//     });
//     const data = await envelope.json();
//     if (data.error) {
//       localStorage.removeItem("token");
//       this.renderHomepage();
//       return;
//     }
//     const response = data as Game;
//     this.clientGameContextManager.createClientGameContext(response);
//   }

//   private renderHomepage() {
//     this.homepageView.render();
//   }
// }

// export function provideClientGameManager(resolver: DependencyResolver) {
//   return new ClientGameManager(
//     resolver.resolve(clientConfigDependency),
//     resolver.resolve(clientGameContextManagerDependency),
//     resolver.resolve(createGameChannelDependency),
//     resolver.resolve(homepageViewDependency),
//     resolver.resolve(joinGameChannelDependency),
//     resolver.resolve(quitGameChannelDependency),
//   );
// }
// export const clientGameManagerDependency = defineDependency({
//   name: "client-game-manager",
//   provider: provideClientGameManager,
// });
