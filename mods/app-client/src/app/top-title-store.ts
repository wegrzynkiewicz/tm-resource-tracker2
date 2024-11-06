import { Channel } from "@framework/dom/channel.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { frontendScopeToken } from "../defs.ts";
import { appNameDependency } from "./app-name-config.ts";
import { Context } from "@framework/dependency/context.ts";

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
  scopeToken: frontendScopeToken,
});
