import type { RouteBuilder } from "../http/route-builder.js";
import { RestRequest } from "../http/rest-request.js";
import type { HttpMethod } from "../http/rest-request.js";
import type { ResponseType, RestClientExecutor } from "../http/rest-client.js";

export interface ExecuteOptions {
  readonly accessToken?: string;
  readonly headers?: Record<string, string>;
  readonly signal?: AbortSignal;
  readonly apiVersion?: string;
  readonly responseType?: ResponseType;
}

export abstract class ClientBase {
  protected constructor(
    protected readonly restClient: RestClientExecutor,
    protected readonly routeBuilder: RouteBuilder,
  ) {}

  protected async execute(
    relativeEndpoint: string,
    httpMethod: HttpMethod,
    options: ExecuteOptions = {},
  ): Promise<void> {
    const request = this.createRequest(relativeEndpoint, httpMethod, options);
    await this.restClient.sendWithoutResult(request, options.signal);
  }

  protected async executeWithResponse<TResponse>(
    relativeEndpoint: string,
    httpMethod: HttpMethod,
    options: ExecuteOptions = {},
  ): Promise<TResponse> {
    const request = this.createRequest(relativeEndpoint, httpMethod, options);
    return this.restClient.send<TResponse>(request, options.signal, options.responseType);
  }

  protected async executeWithBody<TBody>(
    relativeEndpoint: string,
    body: TBody,
    options: ExecuteOptions = {},
  ): Promise<void> {
    const request = this.createRequest(relativeEndpoint, "POST", options).withBody(body);
    await this.restClient.sendWithoutResult(request, options.signal);
  }

  protected async executeWithBodyAndResponse<TResponse, TBody>(
    relativeEndpoint: string,
    body: TBody,
    options: ExecuteOptions = {},
  ): Promise<TResponse> {
    const request = this.createRequest(relativeEndpoint, "POST", options).withBody(body);
    return this.restClient.sendWithBody<TResponse, TBody>(request, options.signal, options.responseType);
  }

  protected async executeAbsoluteWithResponse<TResponse>(
    absoluteUri: string,
    httpMethod: HttpMethod,
    signal?: AbortSignal,
    responseType: ResponseType = "json",
  ): Promise<TResponse> {
    if (!absoluteUri || absoluteUri.trim().length === 0) {
      throw new Error("Absolute URI cannot be empty");
    }

    const request = RestRequest.new(absoluteUri, httpMethod);
    return this.restClient.send<TResponse>(request, signal, responseType);
  }

  private createRequest(relativeEndpoint: string, httpMethod: HttpMethod, options: ExecuteOptions): RestRequest {
    const path = this.routeBuilder.build(relativeEndpoint, options.apiVersion);
    const request = RestRequest.new(path, httpMethod);

    if (options.accessToken) {
      request.addAccessToken(options.accessToken);
    }

    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        if (value !== undefined) {
          request.addHeader(key, value);
        }
      }
    }

    return request;
  }
}
