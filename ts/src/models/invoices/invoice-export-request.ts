import type { EncryptionInfo } from "../sessions/encryption.js";
import type { InvoiceQueryFilters } from "./invoice-query-filters.js";

export interface InvoiceExportRequest {
  readonly encryption: EncryptionInfo;
  readonly filters: InvoiceQueryFilters;
}
