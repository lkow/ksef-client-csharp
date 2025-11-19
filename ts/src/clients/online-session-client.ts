import { Routes } from "../http/routes.js";
import type { RouteBuilder } from "../http/route-builder.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { OpenOnlineSessionRequest, OpenOnlineSessionResponse, SendInvoiceResponse } from "../models/sessions/online-session.js";
import type { SendInvoiceRequest } from "../models/sessions/send-invoice-request.js";
import { ClientBase } from "./client-base.js";

export interface OnlineSessionClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IOnlineSessionClient {
  openOnlineSessionAsync(
    requestPayload: OpenOnlineSessionRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OpenOnlineSessionResponse>;

  sendOnlineSessionInvoiceAsync(
    requestPayload: SendInvoiceRequest,
    sessionReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<SendInvoiceResponse>;

  closeOnlineSessionAsync(sessionReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void>;
}

export class OnlineSessionClient extends ClientBase implements IOnlineSessionClient {
  constructor(dependencies: OnlineSessionClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public openOnlineSessionAsync(
    requestPayload: OpenOnlineSessionRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OpenOnlineSessionResponse> {
    if (!requestPayload) {
      throw new Error("Open online session payload is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    return this.executeWithBodyAndResponse(Routes.Sessions.Online.Open, requestPayload, { accessToken, signal });
  }

  public sendOnlineSessionInvoiceAsync(
    requestPayload: SendInvoiceRequest,
    sessionReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<SendInvoiceResponse> {
    if (!requestPayload) {
      throw new Error("Send invoice payload is required");
    }
    if (!sessionReferenceNumber?.trim()) {
      throw new Error("Session reference number is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    return this.executeWithBodyAndResponse(
      Routes.Sessions.Online.Invoices(sessionReferenceNumber),
      requestPayload,
      { accessToken, signal },
    );
  }

  public closeOnlineSessionAsync(sessionReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void> {
    if (!sessionReferenceNumber?.trim()) {
      throw new Error("Session reference number is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    return this.execute(Routes.Sessions.Online.Close(sessionReferenceNumber), "POST", { accessToken, signal });
  }
}
