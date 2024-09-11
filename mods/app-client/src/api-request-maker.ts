import { DependencyResolver, defineDependency } from "@acme/dependency/injection.ts";
import { RequestMaker } from "./request-maker.ts";
import { apiURLDependency } from "./api-url-config.ts";
import { frontendScopeContract } from "../bootstrap.ts";

export function provideApiRequestMaker(resolver: DependencyResolver) {
  return new RequestMaker(
    resolver.resolve(apiURLDependency),
  );
}
export const apiRequestMakerDependency = defineDependency({
  kind: "api-request-maker",
  provider: provideApiRequestMaker,
  scope: frontendScopeContract,
});
