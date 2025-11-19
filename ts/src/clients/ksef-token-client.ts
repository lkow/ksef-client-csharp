import { ClientBase } from "./client-base.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { RouteBuilder } from "../http/route-builder.js";
import { Routes } from "../http/routes.js";
import { appendPagination } from "../http/helpers/pagination.js";
import type {
  AuthenticationKsefToken,
  AuthenticationKsefTokenStatus,
  KsefTokenRequest,
  KsefTokenResponse,
  QueryKsefTokensResponse,
} from "../models/authorization/ksef-token.js";
import type { TokenContextIdentifierType } from "../models/token/index.js";
import { regexUnescape } from "../utils/regexUnescape.js";

export interface KsefTokenClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface QueryKsefTokensOptions {
  readonly statuses?: readonly AuthenticationKsefTokenStatus[];
  readonly authorIdentifier?: string;
  readonly authorIdentifierType?: TokenContextIdentifierType;
  readonly description?: string;
  readonly continuationToken?: string;
  readonly pageSize?: number;
  readonly signal?: AbortSignal;
}

export interface IKsefTokenClient {
  generateKsefToken(
    requestPayload: KsefTokenRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<KsefTokenResponse>;
  queryKsefTokens(accessToken: string, options?: QueryKsefTokensOptions): Promise<QueryKsefTokensResponse>;
  getKsefToken(
    tokenReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<AuthenticationKsefToken>;
  revokeKsefToken(tokenReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void>;
}

export class KsefTokenClient extends ClientBase implements IKsefTokenClient {
  constructor(dependencies: KsefTokenClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public generateKsefToken(
    requestPayload: KsefTokenRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<KsefTokenResponse> {
    if (!requestPayload) {
      throw new Error("requestPayload cannot be null");
    }

    return this.executeWithBodyAndResponse(Routes.Tokens.Root, requestPayload, {
      accessToken: this.ensureAccessToken(accessToken),
      signal,
    });
  }

  public queryKsefTokens(
    accessToken: string,
    options: QueryKsefTokensOptions = {},
  ): Promise<QueryKsefTokensResponse> {
    const trimmedToken = this.ensureAccessToken(accessToken);
    const params = new URLSearchParams();

    if (options.statuses && options.statuses.length > 0) {
      for (const status of options.statuses) {
        if (status) {
          params.append("status", status);
        }
      }
    }

    const authorIdentifier = options.authorIdentifier?.trim();
    if (authorIdentifier) {
      params.set("authorIdentifier", authorIdentifier);
    }

    if (options.authorIdentifierType) {
      params.set("authorIdentifierType", options.authorIdentifierType);
    }

    const description = options.description?.trim();
    if (description) {
      params.set("description", description);
    }

    let endpoint = Routes.Tokens.Root;
    const baseQuery = params.toString();
    if (baseQuery) {
      endpoint = `${endpoint}?${baseQuery}`;
    }

    endpoint = appendPagination(endpoint, undefined, options.pageSize ?? null);

    const headers = options.continuationToken && options.continuationToken.trim().length > 0
      ? { "x-continuation-token": regexUnescape(options.continuationToken) }
      : undefined;

    return this.executeWithResponse(endpoint, "GET", {
      accessToken: trimmedToken,
      headers,
      signal: options.signal,
    });
  }

  public getKsefToken(
    tokenReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<AuthenticationKsefToken> {
    const trimmedReference = tokenReferenceNumber?.trim();
    if (!trimmedReference) {
      throw new Error("tokenReferenceNumber cannot be empty");
    }

    const endpoint = Routes.Tokens.ByReference(encodeURIComponent(trimmedReference));
    return this.executeWithResponse(endpoint, "GET", {
      accessToken: this.ensureAccessToken(accessToken),
      signal,
    });
  }

  public revokeKsefToken(tokenReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void> {
    const trimmedReference = tokenReferenceNumber?.trim();
    if (!trimmedReference) {
      throw new Error("tokenReferenceNumber cannot be empty");
    }

    const endpoint = Routes.Tokens.ByReference(encodeURIComponent(trimmedReference));
    return this.execute(endpoint, "DELETE", {
      accessToken: this.ensureAccessToken(accessToken),
      signal,
    });
  }

  private ensureAccessToken(token: string): string {
    const trimmed = token?.trim();
    if (!trimmed) {
      throw new Error("accessToken cannot be empty");
    }

    return trimmed;
  }
}

