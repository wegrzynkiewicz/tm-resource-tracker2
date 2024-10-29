import { Channel } from "@acme/dom/channel.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { appNameDependency } from "./app-name-config.ts";
import { Context } from "../../../../qcmf5/mods/dependency/context.ts";

export class TopTitleStore {
  public readonly updates = new Channel<[]>();

  public constructor(
    public title: string,
  ) {}

  public setTitle(title: string) {
    this.title = title;
    this.updates.emit();
  }
}

export function provideTopTitle(context: Context) {
  return new TopTitleStore(
    context.resolve(appNameDependency),
  );
}

export const topTitleStoreDependency = defineDependency({
  provider: provideTopTitle,
  scope: frontendScopeContract,
});
