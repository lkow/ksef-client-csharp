import type { ResponseType, RestClientExecutor } from "../../http/rest-client.js";
import type { RestRequest, RestRequestWithBody } from "../../http/rest-request.js";

export class FakeRestClient implements RestClientExecutor {
  public lastRequest?: RestRequest;
  public lastResponseType?: ResponseType;

  constructor(public response: unknown = undefined) {}

  async send<TResponse>(request: RestRequest, _signal?: AbortSignal, responseType: ResponseType = "json"): Promise<TResponse> {
    this.lastRequest = request;
    this.lastResponseType = responseType;
    return this.response as TResponse;
  }

  async sendWithoutResult(request: RestRequest): Promise<void> {
    this.lastRequest = request;
  }

  async sendWithBody<TResponse, TBody>(
    request: RestRequestWithBody<TBody>,
    _signal?: AbortSignal,
    responseType: ResponseType = "json",
  ): Promise<TResponse> {
    this.lastRequest = request;
    this.lastResponseType = responseType;
    return this.response as TResponse;
  }
}
