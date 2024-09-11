import { Channel } from "@acme/dependency/channel.ts";
import { defineDependency } from "@acme/dependency/injection.ts";
import { frontendScopeContract } from "../../bootstrap.ts";

export class TitleStore extends Channel<[]> {
  public defaults = "TM Resource Tracker v2";
  public title = this.defaults;
}

export function provideTitle() {
  return new TitleStore();
}
export const titleStoreDependency = defineDependency({
  kind: "title-store",
  provider: provideTitle,
  scope: frontendScopeContract,
});

