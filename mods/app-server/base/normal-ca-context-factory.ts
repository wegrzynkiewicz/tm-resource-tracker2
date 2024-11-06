import { NormalCAContextFactory } from "@acme/control-action/normal/defs.ts";
import { Context } from "@acme/dependency/context.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { serverGameScopeToken, serverPlayerScopeToken } from "../defs.ts";
import { caScopeToken, duplexScopeToken, globalScopeToken, Scope } from "@acme/dependency/scopes.ts";

export class ServerNormalCAContextFactory implements NormalCAContextFactory {
  public constructor(
    public readonly context: Context,
  ) {}

  public createCAContext(envelope: NormalCAEnvelopeDTO): Context {
    const caContext = new Context({
      [globalScopeToken]: this.context.scopes[globalScopeToken],
      [serverGameScopeToken]: this.context.scopes[serverGameScopeToken],
      [serverPlayerScopeToken]: this.context.scopes[serverPlayerScopeToken],
      [duplexScopeToken]: this.context.scopes[duplexScopeToken],
      [caScopeToken]: new Scope(),
    });
    return caContext;
  }
}
