import { caScopeContract } from "@acme/dependency/scopes.ts";
import { NormalCAContextFactory } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { Context } from "@acme/dependency/context.ts";
import { duplexScopeContract, globalScopeContract, Scope } from "@acme/dependency/scopes.ts";
import { clientGameScopeContract, frontendScopeContract } from "../defs.ts";

export class ClientNormalCAContextFactory implements NormalCAContextFactory {
  public constructor(
    public readonly context: Context,
  ) {}

  public createCAContext(envelope: NormalCAEnvelopeDTO): Context {
    const { id, name } = envelope;
    const caContext = new Context({
      [globalScopeContract.token]: this.context.scopes[globalScopeContract.token],
      [frontendScopeContract.token]: this.context.scopes[frontendScopeContract.token],
      [clientGameScopeContract.token]: this.context.scopes[clientGameScopeContract.token],
      [duplexScopeContract.token]: this.context.scopes[duplexScopeContract.token],
      [caScopeContract.token]: new Scope(caScopeContract),
    });
    return caContext;
  }
}
