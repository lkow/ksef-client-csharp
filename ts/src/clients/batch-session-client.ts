import { sendPackagePartsAsync } from "./batch-parts-sender.js";
import { Routes } from "../http/routes.js";
import type { RouteBuilder } from "../http/route-builder.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import {
  type BatchPartSendingInfo,
  type BatchPartStreamSendingInfo,
  type OpenBatchSessionRequest,
  type OpenBatchSessionResponse,
} from "../models/sessions/batch-session.js";
import { ClientBase } from "./client-base.js";

export interface BatchSessionClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IBatchSessionClient {
  openBatchSessionAsync(
    requestPayload: OpenBatchSessionRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OpenBatchSessionResponse>;

  closeBatchSessionAsync(batchSessionReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void>;

  sendBatchPartsAsync(
    openBatchSessionResponse: OpenBatchSessionResponse,
    parts: readonly BatchPartSendingInfo[],
    signal?: AbortSignal,
  ): Promise<void>;

  sendBatchPartsWithStreamAsync(
    openBatchSessionResponse: OpenBatchSessionResponse,
    parts: readonly BatchPartStreamSendingInfo[],
    signal?: AbortSignal,
  ): Promise<void>;
}

export class BatchSessionClient extends ClientBase implements IBatchSessionClient {
  constructor(dependencies: BatchSessionClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public openBatchSessionAsync(
    requestPayload: OpenBatchSessionRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OpenBatchSessionResponse> {
    if (!requestPayload) {
      throw new Error("Open batch session payload is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    return this.executeWithBodyAndResponse(Routes.Sessions.Batch.Open, requestPayload, { accessToken, signal });
  }

  public closeBatchSessionAsync(batchSessionReferenceNumber: string, accessToken: string, signal?: AbortSignal): Promise<void> {
    if (!batchSessionReferenceNumber?.trim()) {
      throw new Error("Batch session reference number is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    return this.execute(Routes.Sessions.Batch.Close(batchSessionReferenceNumber), "POST", { accessToken, signal });
  }

  public async sendBatchPartsAsync(
    openBatchSessionResponse: OpenBatchSessionResponse,
    parts: readonly BatchPartSendingInfo[],
    signal?: AbortSignal,
  ): Promise<void> {
    this.ensurePartsProvided(parts);
    await sendPackagePartsAsync(
      this.restClient,
      openBatchSessionResponse?.partUploadRequests,
      parts,
      (info) => ({ body: info.data, contentType: "application/octet-stream" }),
      signal,
    );
  }

  public async sendBatchPartsWithStreamAsync(
    openBatchSessionResponse: OpenBatchSessionResponse,
    parts: readonly BatchPartStreamSendingInfo[],
    signal?: AbortSignal,
  ): Promise<void> {
    this.ensurePartsProvided(parts);
    await sendPackagePartsAsync(
      this.restClient,
      openBatchSessionResponse?.partUploadRequests,
      parts,
      (info) => ({ body: info.dataStream }),
      signal,
    );
  }

  private ensurePartsProvided(parts: readonly unknown[]): void {
    if (!parts || parts.length === 0) {
      throw new Error("Brak plików do wysłania.");
    }
  }
}
