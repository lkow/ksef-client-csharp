import { appendPagination } from "../http/helpers/pagination.js";
import { Routes } from "../http/routes.js";
import type { RouteBuilder } from "../http/route-builder.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { OperationResponse } from "../models/common.js";
import type { InvoiceExportRequest } from "../models/invoices/invoice-export-request.js";
import type { InvoiceExportStatusResponse } from "../models/invoices/invoice-export-status-response.js";
import type { InvoiceQueryFilters, SortOrder } from "../models/invoices/invoice-query-filters.js";
import type { PagedInvoiceResponse } from "../models/invoices/paged-invoice-response.js";
import { ClientBase } from "./client-base.js";

export interface InvoiceDownloadClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IInvoiceDownloadClient {
  getInvoiceAsync(ksefNumber: string, accessToken: string, signal?: AbortSignal): Promise<string>;
  queryInvoiceMetadataAsync(
    requestPayload: InvoiceQueryFilters,
    accessToken: string,
    pageOffset?: number,
    pageSize?: number,
    sortOrder?: SortOrder,
    signal?: AbortSignal,
  ): Promise<PagedInvoiceResponse>;
  exportInvoicesAsync(
    requestPayload: InvoiceExportRequest,
    accessToken: string,
    signal?: AbortSignal,
    includeMetadata?: boolean,
  ): Promise<OperationResponse>;
  getInvoiceExportStatusAsync(
    referenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<InvoiceExportStatusResponse>;
}

export class InvoiceDownloadClient extends ClientBase implements IInvoiceDownloadClient {
  constructor(dependencies: InvoiceDownloadClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public getInvoiceAsync(ksefNumber: string, accessToken: string, signal?: AbortSignal): Promise<string> {
    if (!ksefNumber?.trim()) {
      throw new Error("KSeF number is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    return this.executeWithResponse(Routes.Invoices.ByKsefNumber(ksefNumber), "GET", {
      accessToken,
      headers: { Accept: "application/xml" },
      signal,
      responseType: "text",
    });
  }

  public queryInvoiceMetadataAsync(
    requestPayload: InvoiceQueryFilters,
    accessToken: string,
    pageOffset?: number,
    pageSize?: number,
    sortOrder: SortOrder = "Asc",
    signal?: AbortSignal,
  ): Promise<PagedInvoiceResponse> {
    if (!requestPayload) {
      throw new Error("Invoice query filters are required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    const endpoint = appendPagination(`${Routes.Invoices.QueryMetadata}?sortOrder=${sortOrder}`, pageOffset, pageSize);
    return this.executeWithBodyAndResponse(endpoint, requestPayload, { accessToken, signal });
  }

  public exportInvoicesAsync(
    requestPayload: InvoiceExportRequest,
    accessToken: string,
    signal?: AbortSignal,
    includeMetadata = true,
  ): Promise<OperationResponse> {
    if (!requestPayload) {
      throw new Error("Invoice export request is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    const headers = includeMetadata ? { "x-ksef-feature": "include-metadata" } : undefined;
    return this.executeWithBodyAndResponse(Routes.Invoices.Exports, requestPayload, { accessToken, headers, signal });
  }

  public getInvoiceExportStatusAsync(
    referenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<InvoiceExportStatusResponse> {
    if (!referenceNumber?.trim()) {
      throw new Error("Reference number is required");
    }
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    return this.executeWithResponse(Routes.Invoices.ExportByReference(referenceNumber), "GET", { accessToken, signal });
  }
}
