import { DependencyResolver } from "@acme/dependency/injection.ts";

export interface Context<TIdentifier> {
  descriptor: string;
  identifier: TIdentifier;
  resolver: DependencyResolver;
}
