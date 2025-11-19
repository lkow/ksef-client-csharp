import { ClientBase } from "./client-base.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { RouteBuilder } from "../http/route-builder.js";
import { Routes } from "../http/routes.js";
import { appendPagination } from "../http/helpers/pagination.js";
import type { SessionInvoicesResponse, SessionInvoice } from "../models/sessions/session-invoices.js";
import type { SessionsListResponse } from "../models/sessions/session.js";
import type { SessionsFilter, SessionType } from "../models/sessions/sessions-filter.js";
import type { SessionStatusResponse } from "../models/sessions/session-status.js";
import { applySessionsFilterParams } from "../utils/sessions-filter-query.js";
import { regexUnescape } from "../utils/regexUnescape.js";

export interface SessionStatusClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface GetSessionsOptions {
  readonly pageSize?: number;
  readonly continuationToken?: string;
  readonly filter?: SessionsFilter;
  readonly signal?: AbortSignal;
}

export interface SessionInvoicesQueryOptions {
  readonly pageSize?: number;
  readonly continuationToken?: string;
  readonly signal?: AbortSignal;
}

export interface ISessionStatusClient {
  getSessions(
    sessionType: SessionType,
    accessToken: string,
    options?: GetSessionsOptions,
  ): Promise<SessionsListResponse>;
  getSessionStatus(sessionReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<SessionStatusResponse>;
  getSessionInvoices(
    sessionReferenceNumber: string,
    accessToken: string,
    options?: SessionInvoicesQueryOptions,
  ): Promise<SessionInvoicesResponse>;
  getSessionInvoice(
    sessionReferenceNumber: string,
    invoiceReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<SessionInvoice>;
  getSessionFailedInvoices(
    sessionReferenceNumber: string,
    accessToken: string,
    options?: SessionInvoicesQueryOptions,
  ): Promise<SessionInvoicesResponse>;
  getSessionInvoiceUpoByKsefNumber(
    sessionReferenceNumber: string,
    ksefNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<string>;
  getSessionInvoiceUpoByReferenceNumber(
    sessionReferenceNumber: string,
    invoiceReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<string>;
  getSessionUpo(sessionReferenceNumber: string, upoReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<string>;
  getUpo(uri: string | URL, signal?: AbortSignal): Promise<string>;
}

export class SessionStatusClient extends ClientBase implements ISessionStatusClient {
  constructor(dependencies: SessionStatusClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public getSessions(
    sessionType: SessionType,
    accessToken: string,
    options: GetSessionsOptions = {},
  ): Promise<SessionsListResponse> {
    const trimmedToken = this.ensureAccessToken(accessToken);
    const params = new URLSearchParams();
    params.set("sessionType", sessionType);

    if (options.pageSize != null && options.pageSize > 0) {
      params.set("pageSize", options.pageSize.toString());
    }

    applySessionsFilterParams(params, options.filter);

    let endpoint = `${Routes.Sessions.Root}?${params.toString()}`;
    const headers = this.buildContinuationHeader(options.continuationToken);

    return this.executeWithResponse(endpoint, "GET", {
      accessToken: trimmedToken,
      headers,
      signal: options.signal,
    });
  }

  public getSessionStatus(
    sessionReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<SessionStatusResponse> {
    const reference = this.ensureReference(sessionReferenceNumber, "sessionReferenceNumber");
    const endpoint = Routes.Sessions.ByReference(encodeURIComponent(reference));
    return this.executeWithResponse(endpoint, "GET", { accessToken: this.ensureAccessToken(accessToken), signal });
  }

  public getSessionInvoices(
    sessionReferenceNumber: string,
    accessToken: string,
    options: SessionInvoicesQueryOptions = {},
  ): Promise<SessionInvoicesResponse> {
    return this.getInvoicesInternal(Routes.Sessions.Invoices, sessionReferenceNumber, accessToken, options);
  }

  public getSessionInvoice(
    sessionReferenceNumber: string,
    invoiceReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<SessionInvoice> {
    const sessionRef = this.ensureReference(sessionReferenceNumber, "sessionReferenceNumber");
    const invoiceRef = this.ensureReference(invoiceReferenceNumber, "invoiceReferenceNumber");
    const endpoint = Routes.Sessions.Invoice(encodeURIComponent(sessionRef), encodeURIComponent(invoiceRef));
    return this.executeWithResponse(endpoint, "GET", { accessToken: this.ensureAccessToken(accessToken), signal });
  }

  public getSessionFailedInvoices(
    sessionReferenceNumber: string,
    accessToken: string,
    options: SessionInvoicesQueryOptions = {},
  ): Promise<SessionInvoicesResponse> {
    return this.getInvoicesInternal(Routes.Sessions.FailedInvoices, sessionReferenceNumber, accessToken, options);
  }

  public getSessionInvoiceUpoByKsefNumber(
    sessionReferenceNumber: string,
    ksefNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<string> {
    const sessionRef = this.ensureReference(sessionReferenceNumber, "sessionReferenceNumber");
    const invoiceNumber = this.ensureReference(ksefNumber, "ksefNumber");
    const endpoint = Routes.Sessions.UpoByKsefNumber(
      encodeURIComponent(sessionRef),
      encodeURIComponent(invoiceNumber),
    );
    return this.executeWithResponse(endpoint, "GET", {
      accessToken: this.ensureAccessToken(accessToken),
      responseType: "text",
      signal,
    });
  }

  public getSessionInvoiceUpoByReferenceNumber(
    sessionReferenceNumber: string,
    invoiceReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<string> {
    const sessionRef = this.ensureReference(sessionReferenceNumber, "sessionReferenceNumber");
    const invoiceRef = this.ensureReference(invoiceReferenceNumber, "invoiceReferenceNumber");
    const endpoint = Routes.Sessions.UpoByInvoiceReference(
      encodeURIComponent(sessionRef),
      encodeURIComponent(invoiceRef),
    );
    return this.executeWithResponse(endpoint, "GET", {
      accessToken: this.ensureAccessToken(accessToken),
      responseType: "text",
      signal,
    });
  }

  public getSessionUpo(
    sessionReferenceNumber: string,
    upoReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<string> {
    const sessionRef = this.ensureReference(sessionReferenceNumber, "sessionReferenceNumber");
    const upoRef = this.ensureReference(upoReferenceNumber, "upoReferenceNumber");
    const endpoint = Routes.Sessions.Upo(encodeURIComponent(sessionRef), encodeURIComponent(upoRef));
    return this.executeWithResponse(endpoint, "GET", {
      accessToken: this.ensureAccessToken(accessToken),
      responseType: "text",
      signal,
    });
  }

  public getUpo(uri: string | URL, signal?: AbortSignal): Promise<string> {
    if (!uri) {
      throw new Error("uri cannot be null");
    }
    const target = typeof uri === "string" ? uri.trim() : uri.toString();
    if (!target) {
      throw new Error("uri cannot be empty");
    }

    return this.executeAbsoluteWithResponse(target, "GET", signal, "text");
  }

  private getInvoicesInternal(
    routeFactory: (referenceNumber: string) => string,
    sessionReferenceNumber: string,
    accessToken: string,
    options: SessionInvoicesQueryOptions,
  ): Promise<SessionInvoicesResponse> {
    const sessionRef = this.ensureReference(sessionReferenceNumber, "sessionReferenceNumber");
    let endpoint = routeFactory(encodeURIComponent(sessionRef));
    endpoint = appendPagination(endpoint, null, options.pageSize ?? null);
    const headers = this.buildContinuationHeader(options.continuationToken);

    return this.executeWithResponse(endpoint, "GET", {
      accessToken: this.ensureAccessToken(accessToken),
      headers,
      signal: options.signal,
    });
  }

  private buildContinuationHeader(continuationToken?: string): Record<string, string> | undefined {
    const value = continuationToken?.trim();
    if (!value) {
      return undefined;
    }
    return { "x-continuation-token": regexUnescape(value) };
  }

  private ensureAccessToken(token: string): string {
    const trimmed = token?.trim();
    if (!trimmed) {
      throw new Error("accessToken cannot be empty");
    }
    return trimmed;
  }

  private ensureReference(value: string, name: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new Error(`${name} cannot be empty`);
    }
    return trimmed;
  }
}
