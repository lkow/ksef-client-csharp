import type { PeppolProvider } from "./peppol-provider.js";

export interface QueryPeppolProvidersResponse {
  readonly hasMore: boolean;
  readonly providers: readonly PeppolProvider[];
}
