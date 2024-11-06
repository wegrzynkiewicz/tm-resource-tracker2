import { Result } from "@framework/useful/result.ts";
import { DEBUG, Logger, WARN } from "@framework/logger/defs.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { LayoutParser } from "@framework/layout/runtime/defs.ts";
import { ErrorDTO } from "@framework/web/docs/error-dto.layout.compiled.ts";
import { webRequestScopeToken } from "@framework/dependency/scopes.ts";
import { webRequestLoggerDependency } from "@framework/web/logger.ts";
import { Context } from "@framework/dependency/context.ts";

export interface ParserResult<TPayload, TParams> {
  payload: TPayload;
}

const expectedContentType = "application/json";

export class JSONRequestParser {
  public constructor(
    private readonly logger: Logger,
  ) {}

  public async parse<T>(parser: LayoutParser<T>, request: Request): Promise<Result<T, Response>> {
    if (request.method === "GET") {
      const payload: ErrorDTO = { error: "expected-request-with-body" };
      const response = Response.json(payload, { status: 405 });
      return [false, response];
    }
    const actualContentType = request.headers.get("content-type")?.toLocaleLowerCase() ?? "";
    if (actualContentType !== "application/json") {
      const payload: ErrorDTO = {
        error: "unexpected-content-type",
        data: {
          actualContentType,
          expectedContentType,
        },
      };
      const response = Response.json(payload, { status: 415 });
      return [false, response];
    }
    // TODO: log
    const body = await request.text();
    let data: unknown;
    try {
      data = JSON.parse(body);
    } catch (error: unknown) {
      const payload: ErrorDTO = { error: "invalid-json-body" };
      this.logger.log(WARN, payload.error, { error, body });
      const response = Response.json(payload, { status: 400 });
      return [false, response];
    }

    const [status, contract, path, key, params] = parser(data);
    if (status === false) {
      const result = { contract, path, key, params };
      const payload: ErrorDTO = { error: "invalid-json-payload", data: { result } };
      this.logger.log(DEBUG, payload.error, { result });
      const response = Response.json(payload, { status: 400 });
      return [false, response];
    }
    return [true, contract];
  }
}

export function provideJSONRequestParser(context: Context) {
  return new JSONRequestParser(
    context.resolve(webRequestLoggerDependency),
  );
}

export const jsonRequestParserDependency = defineDependency({
  provider: provideJSONRequestParser,
  scopeToken: webRequestScopeToken,
});
