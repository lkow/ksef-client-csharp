import { appendPagination } from "../http/helpers/pagination.js";
import { Routes } from "../http/routes.js";
import type { RouteBuilder } from "../http/route-builder.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { QueryPeppolProvidersResponse } from "../models/peppol/query-peppol-providers-response.js";
import { ClientBase } from "./client-base.js";

export interface PeppolClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IPeppolClient {
  queryPeppolProvidersAsync(
    accessToken: string,
    pageOffset?: number,
    pageSize?: number,
    signal?: AbortSignal,
  ): Promise<QueryPeppolProvidersResponse>;
}

export class PeppolClient extends ClientBase implements IPeppolClient {
  constructor(dependencies: PeppolClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public queryPeppolProvidersAsync(
    accessToken: string,
    pageOffset?: number,
    pageSize?: number,
    signal?: AbortSignal,
  ): Promise<QueryPeppolProvidersResponse> {
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }

    const endpoint = appendPagination(Routes.Peppol.Query, pageOffset, pageSize);
    return this.executeWithResponse(endpoint, "GET", { accessToken, signal });
  }
}
