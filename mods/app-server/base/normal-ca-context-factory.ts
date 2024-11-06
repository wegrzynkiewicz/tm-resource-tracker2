import { NormalCAContextFactory } from "@acme/control-action/normal/defs.ts";
import { Context } from "@acme/dependency/context.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { serverGameScopeContract, serverPlayerScopeContract } from "../defs.ts";
import { caScopeToken, duplexScopeToken, globalScopeToken, Scope } from "@acme/dependency/scopes.ts";

export class ServerNormalCAContextFactory implements NormalCAContextFactory {
  public constructor(
    public readonly context: Context,
  ) {}

  public createCAContext(envelope: NormalCAEnvelopeDTO): Context {
    const caContext = new Context({
      [globalScopeToken.token]: this.context.scopes[globalScopeToken.token],
      [serverGameScopeContract.token]: this.context.scopes[serverGameScopeContract.token],
      [serverPlayerScopeContract.token]: this.context.scopes[serverPlayerScopeContract.token],
      [duplexScopeToken.token]: this.context.scopes[duplexScopeToken.token],
      [caScopeToken.token]: new Scope(caScopeToken),
    });
    return caContext;
  }
}
