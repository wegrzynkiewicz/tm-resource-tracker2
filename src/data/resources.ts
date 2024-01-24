export type ResourceType = "points" | "gold" | "steel" | "titan" | "plant" | "energy" | "heat";
export type ResourceTarget = "production" | "amount";
export type ResourceStoreSupplies = Record<ResourceType, number>;
export type ResourceStore = Record<ResourceTarget, ResourceStoreSupplies>;
export type ResourceProducer = (store: ResourceStore, type: ResourceType) => void;

export interface Resource {
  count: number;
  target: ResourceTarget;
  type: ResourceType;
}

export interface ResourceDefinitionItem {
  type: ResourceType,
  targets: {
    production: {
      min: number,
      processor: ResourceProducer,
    },
    amount: {
      min: number,
    }
  },
}

export function createResourceDefinitionItem(
  { type, minAmount, minProd, processor }: {
    type: ResourceType,
    minAmount?: number,
    minProd?: number,
    processor?: ResourceProducer,
  }
) {
  return {
    type,
    targets: {
      production: {
        min: minProd ?? 0,
        processor: processor ?? processNormalProduction,
      },
      amount: {
        min: minAmount ?? 0,
      }
    }
  }
}

export function processNormalProduction(store: ResourceStore, type: ResourceType) {
  store.amount[type] += store.production[type];
}

export function processPointsProduction(store: ResourceStore) {
  store.amount.gold += store.amount.points;
}

export function processEnergyProduction(store: ResourceStore) {
  store.amount.heat += store.amount.energy;
  store.amount.energy = store.production.energy;
}

export const resources: ResourceDefinitionItem[] = [
  createResourceDefinitionItem({ type: "points", minAmount: 1, processor: processPointsProduction }),
  createResourceDefinitionItem({ type: "gold", minProd: -5 }),
  createResourceDefinitionItem({ type: "steel" }),
  createResourceDefinitionItem({ type: "titan" }),
  createResourceDefinitionItem({ type: "plant" }),
  createResourceDefinitionItem({ type: "energy", processor: processEnergyProduction }),
  createResourceDefinitionItem({ type: "heat" }),
];

export const resourcesByType: Record<ResourceType, ResourceDefinitionItem> = {
    points: resources[0],
    gold: resources[1],
    steel: resources[2],
    titan: resources[3],
    plant: resources[4],
    energy: resources[5],
    heat: resources[6],
}

export function createResourceStoreTarget(points: number): ResourceStoreSupplies {
  return {
    points,
    gold: 0,
    steel: 0,
    titan: 0,
    plant: 0,
    energy: 0,
    heat: 0,
  }
}

export function createResourceStore(points: number): ResourceStore {
  return {
    production: createResourceStoreTarget(0),
    amount: createResourceStoreTarget(points),
  }
}
