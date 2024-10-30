import { ResourceUpdateC2SReqDTO } from './resource-update-c2s-req-dto.layout.compiled.ts';
import { Channel } from "@acme/dom/channel.ts";
import { ResourceType } from "./resource-type.layout.compiled.ts";
import { ResourceTarget } from "./resource-target.layout.compiled.ts";
import { defineNormalCA } from "@acme/control-action/normal/defs.ts";

export type ResourceMatrix = Record<ResourceTarget, number>;

export function createResourceMatrix(amount = 0, production = 0): ResourceMatrix {
  return { amount, production };
}

export class ResourceStore {
  public updates = new Channel<[]>();
  public points = createResourceMatrix();
  public gold = createResourceMatrix();
  public steel = createResourceMatrix();
  public titan = createResourceMatrix();
  public plant = createResourceMatrix();
  public energy = createResourceMatrix();
  public heat = createResourceMatrix();
}

export interface Resource {
  type: ResourceType;
  minProduction: number;
}

export function defineResource(
  type: ResourceType,
  minProduction: number,
) {
  return { type, minProduction };
}

export function production(store: ResourceStore) {
  const { gold, steel, titan, plant, points, energy, heat } = store;

  gold.amount += gold.production;
  gold.amount += points.amount;
  steel.amount += steel.production;
  titan.amount += titan.production;
  plant.amount += plant.production;
  heat.amount += heat.production;
  heat.amount += energy.amount;
  energy.amount = energy.production;
}

export const resources: Resource[] = [
  defineResource("points", 1),
  defineResource("gold", -5),
  defineResource("steel", 0),
  defineResource("titan", 0),
  defineResource("plant", 0),
  defineResource("energy", 0),
  defineResource("heat", 0),
];

export const resourceUpdateC2SReqNormalCAContract = defineNormalCA<ResourceUpdateC2SReqDTO>("c2s-req-resource-update");
