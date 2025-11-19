import type { InvoiceSummary } from "./invoice-summary.js";

export interface PagedInvoiceResponse {
  readonly hasMore: boolean;
  readonly isTruncated: boolean;
  readonly invoices: readonly InvoiceSummary[];
}
