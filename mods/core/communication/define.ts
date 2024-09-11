import { Channel } from "../channel.ts";

export interface GAEnvelope<TData> {
  body: TData;
  kind: string;
}
export type AnyGAEnvelope = GAEnvelope<any>;

export interface GAHandler<TData> {
  handle(data: TData): Promise<void>;
}
export type AnyGAHandler = GAHandler<any>;

export interface GADefinition<TData> {
  kind: string;
}
export type AnyGADefinition = GADefinition<any>;

export function provideReceivingGABus() {
  return new Channel<AnyGAEnvelope>();
}
