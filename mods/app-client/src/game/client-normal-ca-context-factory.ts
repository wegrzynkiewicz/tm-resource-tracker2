import { caScopeToken } from "@framework/dependency/scopes.ts";
import { NormalCAContextFactory } from "@framework/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@framework/control-action/normal/envelope.layout.compiled.ts";
import { Context } from "@framework/dependency/context.ts";
import { duplexScopeToken, globalScopeToken, Scope } from "@framework/dependency/scopes.ts";
import { clientGameScopeToken, frontendScopeToken } from "../defs.ts";

export class ClientNormalCAContextFactory implements NormalCAContextFactory {
  public constructor(
    public readonly context: Context,
  ) {}

  public createCAContext(envelope: NormalCAEnvelopeDTO): Context {
    const { id, name } = envelope;
    const caContext = new Context({
      [globalScopeToken]: this.context.scopes[globalScopeToken],
      [frontendScopeToken]: this.context.scopes[frontendScopeToken],
      [clientGameScopeToken]: this.context.scopes[clientGameScopeToken],
      [duplexScopeToken]: this.context.scopes[duplexScopeToken],
      [caScopeToken]: new Scope(),
    });
    return caContext;
  }
}
