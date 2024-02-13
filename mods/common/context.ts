import { ServiceResolver } from "./dependency.ts";

export interface Context<TIdentifier> {
  descriptor: string;
  identifier: TIdentifier;
  resolver: ServiceResolver;
}
