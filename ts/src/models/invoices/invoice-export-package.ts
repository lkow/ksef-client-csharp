import type { InvoiceExportPackagePart } from "./invoice-export-package-part.js";

export interface InvoiceExportPackage {
  readonly invoiceCount: number;
  readonly size: number;
  readonly parts: readonly InvoiceExportPackagePart[];
  readonly isTruncated: boolean;
  readonly lastIssueDate?: string;
  readonly lastInvoicingDate?: string;
  readonly lastPermanentStorageDate?: string;
}
