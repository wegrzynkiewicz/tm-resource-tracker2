import { ServiceResolver } from "../../../common/dependency.ts";
import { div_nodes, div_text } from "../../../common/frontend-framework/dom.ts";
import { provideTitle } from "../../../apps/client/features/config.ts";

export interface IntroTopView {
  $root: HTMLDivElement;
}

export function provideIntroTopView(resolver: ServiceResolver): IntroTopView {
  const title = resolver.resolve(provideTitle);
  const $root = div_nodes("top", [
    div_text("top_label", title),
  ])
  return { $root };
}
