import { InferPathParams } from "@acme/endpoint/path.ts";
import { InferPayload } from "@acme/endpoint/payload-json.ts";
import { RequestContract, RequestProps } from "@acme/endpoint/request.ts";
import { ResponseContract, ResponseProps } from "@acme/endpoint/response.ts";
import { Panic } from "@acme/useful/errors.ts";

export class RequestMaker {
  public constructor(
    public readonly urlBase: string,
  ) {}

  public makeRequest<TProps extends RequestProps>(
    contract: RequestContract<TProps>,
    pathParams?: InferPathParams<TProps["path"]>,
    payload?: InferPayload<TProps["payload"]>,
  ) {
    const url = new URL(contract.path.create(pathParams ?? {}), this.urlBase);
    const request = new Request(url, {
      method: contract.method,
      headers: {
        // TODO: hardcode
        "content-type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    return request;
  }

  public processEmptyResponse<TProps extends ResponseProps>(
    contract: ResponseContract<TProps>,
    response: Response,
  ) {
    if (response.status !== contract.status) {
      throw new Panic('unexpected-response-status', { contract, actual: response.status });
    }
  }

  public async processJSONResponse<TProps extends ResponseProps>(
    contract: ResponseContract<TProps>,
    response: Response,
  ): Promise<InferPayload<TProps["payload"]>> {
    if (response.status !== contract.status) {
      throw new Panic('unexpected-response-status', { contract, actual: response.status });
    }
    if (contract.payload === null) {
      throw new Panic('contract-not-contain-payload', { contract });
    }
    const contentType = response.headers.get("content-type");
    if (contentType !== contract.payload?.contentType) {
      throw new Panic('unexpected-response-content-type', { contract, actual: contentType });
    }

    const json = await response.text();
    const data = JSON.parse(json);

    return data as InferPayload<TProps["payload"]>;
  }
}
