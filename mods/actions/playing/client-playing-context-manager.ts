import { provideToolbar } from "../../apps/client/features/toolbar.ts";
import { Breaker } from "../../common/asserts.ts";
import { Context } from "../../common/context.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideLogger } from "../../common/logger/global.ts";
import { LoggerFactory, provideLoggerFactory } from "../../common/logger/logger-factory.ts";
import { ClientGameContext } from "../game/client/context.ts";
import { provideSupplyViewRenderer } from "../supply/supply-view-renderer.ts";
import { PlayingGame, providePlayingGame } from "./common.ts";

export interface ClientPlayingContextIdentifier {
  gameId: string;
  playerId: number;
}

export type ClientPlayingContext = Context<ClientPlayingContextIdentifier>;

export function provideClientPlayingContext(): ClientPlayingContext {
  throw new Breaker('client-game-context-must-be-injected');
}

export class ClientPlayingContextManager {

  public context: ClientPlayingContext | null = null;

  public constructor(
    private clientGameContext: ClientGameContext,
    private loggerFactory: LoggerFactory,
  ) { }

  public createClientPlayingContext(playingGame: PlayingGame): ClientPlayingContext {
    const { gameId, playerId } = this.clientGameContext.identifier;
    const resolver = new ServiceResolver(this.clientGameContext.resolver);
    const context: ClientPlayingContext = {
      descriptor: `client-playing`,
      identifier: { gameId, playerId },
      resolver,
    }

    const logger = this.loggerFactory.createLogger('PLAYING', { gameId, playerId });

    resolver.inject(provideClientPlayingContext, context);
    resolver.inject(provideLogger, logger);
    resolver.inject(providePlayingGame, playingGame);

    const toolbar = resolver.resolve(provideToolbar);
    {
      const supplyViewRenderer = resolver.resolve(provideSupplyViewRenderer);
      toolbar.signal.on((key) => {
        switch (key) {
          case "supplies": {
            supplyViewRenderer.render();
            break;
          }
          case "projects":
          case "histories":
          case "settings":
        }
      })
    }

    return context;
  }

  public deleteClientPlayingContext() {
    this.context = null;
  }
}

export function provideClientPlayingContextManager(resolver: ServiceResolver) {
  return new ClientPlayingContextManager(
    resolver.resolve(provideClientPlayingContext),
    resolver.resolve(provideLoggerFactory),
  );
}
