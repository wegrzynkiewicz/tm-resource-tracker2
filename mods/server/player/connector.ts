import { ServiceResolver } from "../../common/dependency.ts";
import { provideGADecoder } from "../../communication/decoder.ts";
import { provideReceivingGABus } from "../../communication/define.ts";
import { provideGAProcessor } from "../../communication/processor.ts";
import { Logger, provideLogger } from "../../logger/global.ts";
import { ServerPlayerContext } from "./context.ts";
import { provideWebSocketChannel } from "../../communication/socket.ts";
import { feedServerGAProcessor } from "./processor.ts";
import { provideGADispatcher } from "../../communication/dispatcher.ts";
import { gameStageGADef } from "../../action/game-stage-ga.ts";

export class PlayerConnector {

  private contexts: Set<ServerPlayerContext> = new Set();

  public constructor(
    private readonly logger: Logger,
  ) { }

  public connectPlayerContext(playerContext: ServerPlayerContext): void {
    const { identifier: { playerId }, resolver } = playerContext;
    this.contexts.add(playerContext);

    const webSocketChannel = resolver.resolve(provideWebSocketChannel);
    console.log(webSocketChannel);
    {
      const gaDecoder = resolver.resolve(provideGADecoder);
      webSocketChannel.messages.handlers.add(gaDecoder);
    }

    const receivingGABus = resolver.resolve(provideReceivingGABus);
    {
      const gaProcesor = resolver.resolve(provideGAProcessor);
      feedServerGAProcessor(resolver, gaProcesor);
      receivingGABus.handlers.add(gaProcesor);
    }

    const gaDispatcher = resolver.resolve(provideGADispatcher);

    webSocketChannel.opens.on(() => {
      this.logger.info(`sending this?`);
      gaDispatcher.send(gameStageGADef, { stage: 'waiting' })
    });

    this.logger.info(`player-connected`, { playerId });
  }

  public async run(): Promise<void> {

  }
}

export function providePlayerConnector(resolver: ServiceResolver) {
  return new PlayerConnector(
    resolver.resolve(provideLogger),
  );
}
