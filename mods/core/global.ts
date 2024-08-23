import { Breaker } from "./asserts.ts";
import { Context } from "./context.ts";
import { ServiceResolver } from "./dependency.ts";

export interface GlobalContextIdentifier {
  type: "global";
}

export type GlobalContext = Context<GlobalContextIdentifier>;

export function provideGlobalContext(): GlobalContext {
  throw new Breaker("global-context-must-be-injected");
}

export function createGlobalContext(): GlobalContext {
  const resolver = new ServiceResolver();
  const context: GlobalContext = {
    descriptor: "/",
    identifier: { type: "global" },
    resolver,
  };
  resolver.inject(provideGlobalContext, context);
  return context;
}
