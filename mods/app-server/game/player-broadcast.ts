import { defineDependency } from "@acme/dependency/declaration.ts";
import { NormalCAContract, NormalCADispatcher } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { serverGameScopeContract } from "../defs.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { Logger, loggerDependency, TRACE } from "@acme/logger/defs.ts";

export class PlayerBroadcast implements NormalCADispatcher {
  public socketByPlayerId = new Map<string, WebSocket>();

  public constructor(
    private readonly logger: Logger,
  ) {}

  public dispatch<T>(contract: NormalCAContract<T>, data: T): void {
    const envelope: NormalCAEnvelopeDTO = { name: contract.name, data };
    const message = JSON.stringify(envelope);
    this.logger.log(TRACE, "player-broadcast", { envelope });
    for (const socket of this.socketByPlayerId.values()) {
      socket.send(message);
    }
  }
}

export function providePlayerBroadcast(resolver: DependencyResolver) {
  return new PlayerBroadcast(
    resolver.resolve(loggerDependency),
  );
}

export const playerBroadcastDependency = defineDependency({
  name: "player-broadcast",
  provider: providePlayerBroadcast,
  scope: serverGameScopeContract,
});
