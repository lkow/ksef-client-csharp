import { buildApiErrorMessage, type ApiErrorResponse } from "../exceptions/api-error-response.js";
import { KsefApiException } from "../exceptions/ksef-api-exception.js";
import { KsefRateLimitException } from "../exceptions/ksef-rate-limit-exception.js";
import { JsonUtil } from "./json-util.js";
import { hasBody } from "./helpers/response.js";
import { withQuery } from "./helpers/url.js";
import type { HttpMethod, RestRequest } from "./rest-request.js";
import { RestRequestWithBody } from "./rest-request.js";
import { RestContentType, RestContentTypeExtensions } from "./rest-content-type.js";

export type ResponseType = "json" | "text" | "void";

export interface RestClientExecutor {
  send<TResponse>(request: RestRequest, signal?: AbortSignal, responseType?: ResponseType): Promise<TResponse>;
  sendWithoutResult(request: RestRequest, signal?: AbortSignal): Promise<void>;
  sendWithBody<TResponse, TBody>(
    request: RestRequestWithBody<TBody>,
    signal?: AbortSignal,
    responseType?: ResponseType,
  ): Promise<TResponse>;
}

export interface RestClientOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  fetchFn?: typeof fetch;
}

export interface SendOptions {
  token?: string;
  contentType?: string | RestContentType;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  responseType?: ResponseType;
}

export class RestClient implements RestClientExecutor {
  private readonly baseUrl?: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly fetchImpl: typeof fetch;

  constructor(options: RestClientOptions = {}) {
    this.baseUrl = options.baseUrl;
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.fetchImpl = options.fetchFn ?? globalThis.fetch;
    if (!this.fetchImpl) {
      throw new Error("Fetch API is not available in the current runtime");
    }
  }

  public async sendAsync<TResponse, TRequest>(
    method: HttpMethod,
    url: string,
    requestBody?: TRequest,
    options: SendOptions = {},
  ): Promise<TResponse> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const contentType = RestContentTypeExtensions.getBaseMime(options.contentType ?? RestContentType.Json);

    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const shouldSendBody = method !== "GET" && requestBody !== undefined && requestBody !== null;
    const body = shouldSendBody
      ? RestContentTypeExtensions.isDefaultType(contentType) || contentType.includes("json")
        ? JsonUtil.serialize(requestBody)
        : String(requestBody)
      : undefined;
    if (shouldSendBody) {
      headers["content-type"] = contentType;
    }

    const response = await this.fetchImpl(this.buildUrl(url), {
      method,
      headers,
      body,
      signal: options.signal,
    });

    return this.readResponse<TResponse>(response, method, options.responseType ?? "json");
  }

  public async sendRaw(
    method: HttpMethod,
    url: string,
    content: BodyInit,
    options: Omit<SendOptions, "contentType"> = {},
  ): Promise<void> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };
    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await this.fetchImpl(this.buildUrl(url), {
      method,
      headers,
      body: content,
      signal: options.signal,
    });

    await this.readResponse(response, method, "void");
  }

  public async send<TResponse>(
    request: RestRequest,
    signal?: AbortSignal,
    responseType: ResponseType = "json",
  ): Promise<TResponse> {
    return this.executeRequest<TResponse>(request, responseType, signal);
  }

  public async sendWithoutResult(request: RestRequest, signal?: AbortSignal): Promise<void> {
    await this.executeRequest(request, "void", signal);
  }

  public async sendWithBody<TResponse, TBody>(
    request: RestRequestWithBody<TBody>,
    signal?: AbortSignal,
    responseType: ResponseType = "json",
  ): Promise<TResponse> {
    return this.executeRequest<TResponse>(request, responseType, signal);
  }

  private async executeRequest<TResponse>(
    request: RestRequest | RestRequestWithBody<unknown>,
    overrideResponseType: ResponseType,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const headers: Record<string, string> = { ...this.defaultHeaders, ...request.headers };
    if (request.accessToken) {
      headers.Authorization = `Bearer ${request.accessToken}`;
    }
    if (request.accept) {
      headers.Accept = request.accept;
    }

    const controller = new AbortController();
    const timeoutId = request.timeoutMs
      ? setTimeout(() => controller.abort(new Error("Request timed out")), request.timeoutMs)
      : undefined;

    const composedSignal = signal
      ? anySignal([controller.signal, signal])
      : controller.signal;

    try {
      const hasBody = request instanceof RestRequestWithBody && request.method !== "GET";
      const body = hasBody
        ? this.normalizeBody(request.body, request.contentType)
        : undefined;

      const targetUrl = withQuery(request.path, request.query, this.baseUrl);
      const requestHeaders = hasBody
        ? { ...headers, "content-type": request.contentType }
        : headers;
      const response = await this.fetchImpl(targetUrl, {
        method: request.method,
        headers: requestHeaders,
        body,
        signal: composedSignal,
      });

      return await this.readResponse<TResponse>(
        response,
        request.method,
        overrideResponseType ?? "json",
      );
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private buildUrl(pathOrUrl: string): string {
    if (/^(https?:)?\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }
    const base = this.baseUrl ?? "";
    return `${base.replace(/\/+$/, "")}/${pathOrUrl.replace(/^\/+/, "")}`;
  }

  private normalizeBody(body: unknown, contentType: string): BodyInit {
    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      return body as BodyInit;
    }

    if (typeof Blob !== "undefined" && body instanceof Blob) {
      return body;
    }

    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) {
      return body as BodyInit;
    }

    if (typeof FormData !== "undefined" && body instanceof FormData) {
      return body;
    }

    if (contentType && !RestContentTypeExtensions.isDefaultType(contentType)) {
      return String(body);
    }

    return JsonUtil.serialize(body);
  }

  private async readResponse<T>(response: Response, method: string, responseType: ResponseType): Promise<T> {
    if (response.ok) {
      if (!hasBody(response, method)) {
        return undefined as T;
      }

      if (responseType === "text") {
        const text = await response.text();
        return (text ?? "") as T;
      }

      if (responseType === "void") {
        return undefined as T;
      }

      if (responseType === "json") {
        if (!isJsonMediaType(response.headers.get("content-type"))) {
          throw new KsefApiException(
            `Unexpected content type '${response.headers.get("content-type") ?? "unknown"}' for JSON response.`,
            response.status,
          );
        }
        const text = await response.text();
        if (!text) {
          return {} as T;
        }
        return JsonUtil.deserialize<T>(text);
      }
    }

    await this.handleInvalidStatus(response);
    throw new Error("handleInvalidStatus must throw");
  }

  private async handleInvalidStatus(response: Response): Promise<void> {
    if (response.status === 404) {
      throw new KsefApiException("Not found", response.status);
    }

    if (response.status === 429) {
      const bodyText = await response.text();
      const error = this.tryDeserialize<ApiErrorResponse>(response, bodyText);
      const message = error
        ? buildApiErrorMessage(error, () => "Przekroczono limit ilości zapytań do API (HTTP 429)")
        : "Przekroczono limit ilości zapytań do API (HTTP 429)";
      throw KsefRateLimitException.fromRetryAfterHeader(
        message,
        response.headers.get("retry-after"),
        error ?? undefined,
      );
    }

    const bodyText = await response.text();
    if (!bodyText) {
      throw new KsefApiException(`HTTP ${response.status}: ${response.statusText || "Unknown"}`, response.status);
    }

    if (!isJsonMediaType(response.headers.get("content-type"))) {
      throw new KsefApiException(`HTTP ${response.status}: ${response.statusText || "Unknown"}`, response.status);
    }

    try {
      const apiError = JsonUtil.deserialize<ApiErrorResponse>(bodyText);
      const message = buildApiErrorMessage(apiError, () => response.statusText || "Unknown error");
      throw new KsefApiException(message, response.status, apiError);
    } catch (error) {
      if (error instanceof KsefApiException) {
        throw error;
      }
      throw new KsefApiException(
        `HTTP ${response.status}: ${response.statusText || "Unknown"}, AdditionalInfo: ${(error as Error).message}`,
        response.status,
        undefined,
        { cause: error instanceof Error ? error : undefined },
      );
    }
  }

  private tryDeserialize<T>(response: Response, text: string): T | undefined {
    if (!text || !isJsonMediaType(response.headers.get("content-type"))) {
      return undefined;
    }
    try {
      return JsonUtil.deserialize<T>(text);
    } catch {
      return undefined;
    }
  }
}

function isJsonMediaType(mediaType: string | null): boolean {
  return typeof mediaType === "string" && mediaType.toLowerCase().includes("json");
}

function anySignal(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  const onAbort = (event: Event) => {
    controller.abort(event instanceof ErrorEvent ? event.error : undefined);
    cleanup();
  };
  const cleanup = () => {
    for (const signal of signals) {
      signal.removeEventListener("abort", onAbort);
    }
  };
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", onAbort);
  }
  return controller.signal;
}
