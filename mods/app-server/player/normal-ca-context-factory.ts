import { NormalCAContextFactory } from "@acme/control-action/normal/defs.ts";
import { Context, createContext } from "@acme/dependency/context.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { serverGameScopeContract, serverPlayerScopeContract } from "../defs.ts";
import {
  caScopeContract,
  duplexScopeContract,
  globalScopeContract,
  localScopeContract,
  Scope,
} from "@acme/dependency/scopes.ts";

export class ServerNormalCAContextFactory implements NormalCAContextFactory {
  public constructor(
    public readonly context: Context,
  ) {}

  public createCAContext(envelope: NormalCAEnvelopeDTO): Context {
    const { id, name } = envelope;
    const caContext = createContext({
      identifier: { id: id ?? 0, name },
      name: "CONTROL-ACTION",
      scopes: {
        [globalScopeContract.token]: this.context.scopes[globalScopeContract.token],
        [serverGameScopeContract.token]: this.context.scopes[serverGameScopeContract.token],
        [serverPlayerScopeContract.token]: this.context.scopes[serverPlayerScopeContract.token],
        [duplexScopeContract.token]: this.context.scopes[duplexScopeContract.token],
        [caScopeContract.token]: new Scope(caScopeContract),
        [localScopeContract.token]: new Scope(localScopeContract),
      },
    });
    return caContext;
  }
}
