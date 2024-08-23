import { Breaker } from "./asserts.ts";

export interface Provider<TInstance> {
  (resolver: ServiceResolver): TInstance;
}

export type UnknownProvider = Provider<unknown>;

export class ServiceResolver {

  public constructor(
    private readonly parent: ServiceResolver | null = null,
  ) { }

  public readonly instances = new Map<UnknownProvider, unknown>();

  public inject<TInstance>(provider: Provider<TInstance>, instance: TInstance): void {
    this.instances.set(provider, instance);
  }

  public get<TInstance>(provider: Provider<TInstance>): TInstance | undefined {
    const existingInstances = this.instances.get(provider);
    if (existingInstances) {
      return existingInstances as TInstance;
    }
    if (this.parent) {
      return this.parent.get(provider);
    }
    return undefined;
  }

  public resolve<TInstance>(provider: Provider<TInstance>): TInstance {
    const existingInstances = this.get(provider);
    if (existingInstances) {
      return existingInstances as TInstance;
    }
    try {
      const instance = provider(this);
      this.instances.set(provider, instance);
      return instance;
    } catch (error) {
      throw new Breaker("error-when-resolving-provider", { provider: provider.name, error });
    }
  }
}
