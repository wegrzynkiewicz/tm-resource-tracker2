import { DependencyResolver } from "@acme/dependency/declaration.ts";

export interface Context<TIdentifier> {
  descriptor: string;
  identifier: TIdentifier;
  resolver: DependencyResolver;
}
