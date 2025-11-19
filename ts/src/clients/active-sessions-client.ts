import { ClientBase } from "./client-base.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { RouteBuilder } from "../http/route-builder.js";
import { Routes } from "../http/routes.js";
import { appendPagination } from "../http/helpers/pagination.js";
import type { AuthenticationListResponse } from "../models/sessions/active-sessions.js";
import { regexUnescape } from "../utils/regexUnescape.js";

export interface ActiveSessionsClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface ActiveSessionsQueryOptions {
  readonly pageSize?: number;
  readonly continuationToken?: string;
  readonly signal?: AbortSignal;
}

export interface IActiveSessionsClient {
  getActiveSessions(accessToken: string, options?: ActiveSessionsQueryOptions): Promise<AuthenticationListResponse>;
  revokeCurrentSession(accessToken: string, signal?: AbortSignal): Promise<void>;
  revokeSession(sessionReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void>;
}

export class ActiveSessionsClient extends ClientBase implements IActiveSessionsClient {
  constructor(dependencies: ActiveSessionsClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public getActiveSessions(
    accessToken: string,
    options: ActiveSessionsQueryOptions = {},
  ): Promise<AuthenticationListResponse> {
    const trimmedToken = this.ensureAccessToken(accessToken);
    let endpoint = Routes.ActiveSessions.Session;
    endpoint = appendPagination(endpoint, null, options.pageSize ?? null);

    const continuationToken = options.continuationToken?.trim();
    const headers = continuationToken ? { "x-continuation-token": regexUnescape(continuationToken) } : undefined;

    return this.executeWithResponse(endpoint, "GET", {
      accessToken: trimmedToken,
      headers,
      signal: options.signal,
    });
  }

  public revokeCurrentSession(accessToken: string, signal?: AbortSignal): Promise<void> {
    return this.execute(Routes.ActiveSessions.CurrentSession, "DELETE", {
      accessToken: this.ensureAccessToken(accessToken),
      signal,
    });
  }

  public revokeSession(sessionReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void> {
    const reference = sessionReferenceNumber?.trim();
    if (!reference) {
      throw new Error("sessionReferenceNumber cannot be empty");
    }

    const endpoint = `${Routes.ActiveSessions.Session}/${encodeURIComponent(reference)}`;
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
