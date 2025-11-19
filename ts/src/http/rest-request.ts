import { RestContentType, RestContentTypeExtensions } from "./rest-content-type.js";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export interface RestRequestInit {
  path: string;
  method: HttpMethod;
}

export class RestRequest {
  public readonly path: string;
  public readonly method: HttpMethod;
  public accessToken?: string;
  public contentType: string = RestContentType.Json;
  public accept?: string;
  public headers: Record<string, string> = {};
  public query: Record<string, string | undefined> = {};
  public timeoutMs?: number;
  public apiVersion?: string;

  private constructor(init: RestRequestInit) {
    this.path = init.path;
    this.method = init.method;
  }

  public static new(path: string, method: HttpMethod): RestRequest {
    return new RestRequest({ path, method });
  }

  public addAccessToken(token: string): this {
    this.accessToken = token;
    return this;
  }

  public addHeader(name: string, value: string): this {
    this.headers = { ...this.headers, [name]: value };
    return this;
  }

  public addQueryParameter(name: string, value: string): this {
    this.query = { ...this.query, [name]: value };
    return this;
  }

  public withAccept(accept: string): this {
    this.accept = accept;
    return this;
  }

  public withTimeout(timeoutMs: number): this {
    this.timeoutMs = timeoutMs;
    return this;
  }

  public withContentType(contentType: RestContentType | string): this {
    this.contentType = typeof contentType === "string" ? contentType : RestContentTypeExtensions.toMime(contentType);
    return this;
  }

  public withApiVersion(apiVersion: string): this {
    this.apiVersion = apiVersion;
    return this;
  }

  public withBody<TBody>(body: TBody, contentType: RestContentType = RestContentType.Json): RestRequestWithBody<TBody> {
    if (body == null) {
      throw new Error("Body cannot be null when constructing RestRequestWithBody");
    }
    const next = new RestRequestWithBody<TBody>({ path: this.path, method: this.method, body });
    next.contentType = RestContentTypeExtensions.toMime(contentType);
    next.accessToken = this.accessToken;
    next.accept = this.accept;
    next.headers = { ...this.headers };
    next.query = { ...this.query };
    next.timeoutMs = this.timeoutMs;
    next.apiVersion = this.apiVersion;
    return next;
  }
}

export class RestRequestWithBody<TBody> extends RestRequest {
  public readonly body: TBody;

  private constructor(init: RestRequestInit & { body: TBody }) {
    super(init);
    this.body = init.body;
  }

  public static new<TBody>(
    path: string,
    method: HttpMethod,
    body: TBody,
    contentType: RestContentType = RestContentType.Json,
  ): RestRequestWithBody<TBody> {
    const request = new RestRequestWithBody<TBody>({ path, method, body });
    request.withContentType(contentType);
    return request;
  }
}
