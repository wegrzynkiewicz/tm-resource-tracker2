import { caScopeToken } from "@acme/dependency/scopes.ts";
import { NormalCAContextFactory } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { Context } from "@acme/dependency/context.ts";
import { duplexScopeToken, globalScopeToken, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeToken, frontendScopeToken } from "../defs.ts";

export class ClientNormalCAContextFactory implements NormalCAContextFactory {
  public constructor(
    public readonly context: Context,
  ) {}

  public createCAContext(envelope: NormalCAEnvelopeDTO): Context {
    const { id, name } = envelope;
    const caContext = new Context({
      [globalScopeToken.token]: this.context.scopes[globalScopeToken.token],
      [frontendScopeToken.token]: this.context.scopes[frontendScopeToken.token],
      [clientGameScopeToken.token]: this.context.scopes[clientGameScopeToken.token],
      [duplexScopeToken.token]: this.context.scopes[duplexScopeToken.token],
      [caScopeToken.token]: new Scope(caScopeToken),
    });
    return caContext;
  }
}
