import { EndpointContract, EndpointProps } from "@acme/endpoint/endpoint.ts";
import { InferPathParams, createURLFromPathContract } from "@acme/endpoint/path.ts";
import { InferPayload } from "@acme/endpoint/payload-json.ts";

export class RequestMaker {
  public constructor(
    public readonly urlBase: string,
  ) {}

  public async makeRequest<TProps extends EndpointProps>(
    contract: EndpointContract<TProps>,
    payload: InferPayload<TProps["request"]["payload"]>,
    pathParams: InferPathParams<TProps["request"]["path"]>,
  ) {
    const url = createURLFromPathContract(contract.request.path, pathParams, this.urlBase);
    const request = new Request(url, {
      method: contract.request.method,
      headers: {
        // TODO: hardcode
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const response = await fetch(request);
    const json = await response.text();
    const data = JSON.parse(json);

    return { response, data };
  }
}
