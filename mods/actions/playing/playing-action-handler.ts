import { GAHandler } from "../../common/communication/define.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { ClientPlayingContextManager, provideClientPlayingContextManager } from "./client-playing-context-manager.ts";
import { PlayingGameGA } from "./common.ts";

export class PlayingGameGAHandler implements GAHandler<PlayingGameGA>{
  public constructor(
    private readonly clientPlayingContextManager: ClientPlayingContextManager,
  ) { }

  public async handle(input: PlayingGameGA): Promise<void> {
    this.clientPlayingContextManager.createClientPlayingContext(input);
  }
}

export function providePlayingGameGAHandler(resolver: ServiceResolver) {
  return new PlayingGameGAHandler(
    resolver.resolve(provideClientPlayingContextManager),
  );
}
