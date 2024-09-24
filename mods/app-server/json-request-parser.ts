import { InferPayload, isJSONPayloadContract } from "@acme/endpoint/payload-json.ts";
import { ErrorFormatter, parseUsingLayout } from "@acme/layout/common.ts";
import { Panic } from "@acme/useful/errors.ts";
import { RequestContract, RequestProps } from "@acme/endpoint/request.ts";
import { Result, Success } from "@acme/useful/result.ts";
import { InferPathParams } from "@acme/endpoint/path.ts";
import { jsonResponse } from "@acme/endpoint/payload-json.ts";
import {
  badRequestErrorResponseContract,
  methodNotAllowedErrorResponseContract,
  unsupportedMediaTypeErrorResponseContract,
} from "@acme/endpoint/build-in/errors.ts";
import { Failure } from "@acme/useful/result.ts";
import { DEBUG, Logger, loggerDependency, WARN } from "@acme/logger/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { endpointScopeContract } from "@acme/dependency/scopes.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export interface ParserResult<TPayload, TParams> {
  payload: TPayload;
}

export class JSONRequestParser {
  private readonly errorFormatter = new ErrorFormatter();

  public constructor(
    private readonly logger: Logger,
  ) {
  }

  public async parse<TProps extends RequestProps>(
    contract: RequestContract<TProps>,
    request: Request,
  ): Promise<
    Result<
      ParserResult<
        InferPayload<TProps["payload"]>,
        InferPathParams<TProps["path"]>
      >,
      Response
    >
  > {
    if (contract.payload === null || isJSONPayloadContract(contract.payload) === false) {
      throw new Panic("invalid-payload");
    }
    if (request.method !== "POST") {
      const method = request.method;
      const data = { error: "invalid-method", data: { method } };
      return new Failure(
        jsonResponse(methodNotAllowedErrorResponseContract, data),
      );
    }
    const contentType = request.headers.get("content-type")?.toLocaleLowerCase() ?? "";
    if (contentType !== "application/json") {
      const data = { error: "invalid-content-type", data: { contentType } };
      return new Failure(
        jsonResponse(unsupportedMediaTypeErrorResponseContract, data),
      );
    }
    // TODO: log
    const body = await request.text();
    let data: unknown;
    try {
      data = JSON.parse(body);
    } catch (error: unknown) {
      const message = "invalid-json";
      const data = { error: "invalid-body", data: { message } };
      this.logger.log(WARN, "invalid-body", { error, body });
      return new Failure(
        jsonResponse(badRequestErrorResponseContract, data),
      );
    }

    const layoutResult = parseUsingLayout(contract.payload.layout, data);
    if (layoutResult.valid === false) {
      const message = this.errorFormatter.format(layoutResult.error);
      const data = { error: "invalid-payload", data: { message } };
      this.logger.log(DEBUG, "invalid-payload", { message, layoutResult });
      return new Failure(
        jsonResponse(badRequestErrorResponseContract, data),
      );
    }
    const result = {
      payload: layoutResult.value as InferPayload<TProps["payload"]>,
      //TODO: path params
    };
    return new Success(result);
  }
}

export function provideJSONRequestParser(resolver: DependencyResolver) {
  return new JSONRequestParser(
    resolver.resolve(loggerDependency),
  );
}
export const jsonRequestParserDependency = defineDependency({
  name: "json-request-parser",
  provider: provideJSONRequestParser,
  scope: endpointScopeContract,
});
